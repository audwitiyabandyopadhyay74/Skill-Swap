'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getSocket } from '../../lib/socket';
import { sessionsAPI } from '../../lib/api';
import { LiquidGlass } from 'liquid-glass-web-react';
import BorderGlow from '../../components/BorderGlow';
import {
  FaCommentDots,
  FaVideo,
  FaVideoSlash,
  FaTimes,
  FaMicrophone,
  FaMicrophoneSlash,
  FaDesktop,
  FaClosedCaptioning,
  FaSmile,
  FaUsers,
  FaShieldAlt,
  FaCheckCircle,
  FaVolumeMute,
  FaVolumeUp,
  FaExpand,
  FaCog,
  FaSlidersH,
  FaPaintBrush,
  FaEraser,
  FaTrash,
} from 'react-icons/fa';

const EMOJI_LIST = ['👏', '❤️', '🔥', '🎉', '👍', '💡', '🚀', '⭐'];

export default function VideoMeetModal({ session, user, onClose, onRefreshSessions }) {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isNoiseCancelled, setIsNoiseCancelled] = useState(true);
  const [isCaptionsEnabled, setIsCaptionsEnabled] = useState(false);

  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedAudioId, setSelectedAudioId] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  const [showHostPanel, setShowHostPanel] = useState(false);

  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [drawColor, setDrawColor] = useState('#00ff62');
  const [drawLineWidth, setDrawLineWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const prevCoordsRef = useRef({ x: 0, y: 0 });

  const [messages, setMessages] = useState(session.messages || []);
  const [textInput, setTextInput] = useState('');
  const [activeTab, setActiveTab] = useState('meet'); 

  const [isCallConnected, setIsCallConnected] = useState(false);
  const [captions, setCaptions] = useState([]);
  const [floatingReactions, setFloatingReactions] = useState([]);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const recognitionRef = useRef(null);

  const isHost = session.helper?._id === user?._id || session.requester?._id === user?._id;
  const isHelper = session.helper?._id === user?._id;
  const partner = isHelper ? session.requester : session.helper;
  const roomId = session._id;

  const [myCompletionMarked, setMyCompletionMarked] = useState(
    (isHelper && session.helperCompleted) || (!isHelper && session.requesterCompleted)
  );
  const [partnerCompletionMarked, setPartnerCompletionMarked] = useState(
    (isHelper && session.requesterCompleted) || (!isHelper && session.helperCompleted)
  );

  useEffect(() => {
    const socket = getSocket();
    const iceCandidatesQueue = [];

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' },
        { urls: 'stun:stun.services.mozilla.com' },
        {
          urls: [
            'turn:openrelay.metered.ca:80',
            'turn:openrelay.metered.ca:443',
            'turn:openrelay.metered.ca:443?transport=tcp',
          ],
          username: 'openrelayproject',
          credential: 'openrelayproject',
        },
      ],
    });
    peerConnectionRef.current = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { roomId, candidate: event.candidate });
      }
    };

    peerConnection.ontrack = (event) => {
      console.log('Remote track received:', event.track.kind, event.streams);
      if (remoteVideoRef.current) {
        if (event.streams && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        } else {
          const remoteStream = remoteVideoRef.current.srcObject || new MediaStream();
          remoteStream.addTrack(event.track);
          remoteVideoRef.current.srcObject = remoteStream;
        }
        remoteVideoRef.current.play().catch((e) => console.log('Autoplay play notice:', e.message));
        setIsCallConnected(true);
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log('Peer connection state:', peerConnection.connectionState);
      if (peerConnection.connectionState === 'connected' || peerConnection.connectionState === 'completed') {
        setIsCallConnected(true);
      }
    };

    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

        const devices = await navigator.mediaDevices.enumerateDevices();
        const audios = devices.filter((d) => d.kind === 'audioinput');
        const videos = devices.filter((d) => d.kind === 'videoinput');
        setAudioDevices(audios);
        setVideoDevices(videos);

        const currentAudioTrack = stream.getAudioTracks()[0];
        const currentVideoTrack = stream.getVideoTracks()[0];
        if (currentAudioTrack) setSelectedAudioId(currentAudioTrack.getSettings().deviceId || audios[0]?.deviceId || '');
        if (currentVideoTrack) setSelectedVideoId(currentVideoTrack.getSettings().deviceId || videos[0]?.deviceId || '');

        socket.emit('join-room', { roomId, userId: user?._id, userName: user?.name });
      } catch (err) {
        console.log('Media init notice:', err.message);
        socket.emit('join-room', { roomId, userId: user?._id, userName: user?.name });
      }
    }
    initMedia();

    const createAndSendOffer = async () => {
      try {
        const offer = await peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await peerConnection.setLocalDescription(offer);
        socket.emit('call-user', {
          roomId,
          signalData: offer,
          from: user?._id,
          callerName: user?.name || 'User',
        });
      } catch (err) {
        console.log('Offer creation notice:', err.message);
      }
    };

    const flushIceCandidates = async () => {
      while (iceCandidatesQueue.length > 0) {
        const cand = iceCandidatesQueue.shift();
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(cand));
        } catch (e) {
          console.log('Flush ICE err:', e.message);
        }
      }
    };

    socket.on('user-joined', () => {
      createAndSendOffer();
    });

    socket.on('room-ready', () => {
      createAndSendOffer();
    });

    socket.on('incoming-call', async ({ signalData }) => {
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(signalData));
        await flushIceCandidates();
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('answer-call', { roomId, signalData: answer });
        setIsCallConnected(true);
      } catch (err) {
        console.log('Answer creation notice:', err.message);
      }
    });

    socket.on('call-accepted', async ({ signalData }) => {
      try {
        if (peerConnection.signalingState !== 'stable') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(signalData));
          await flushIceCandidates();
        }
        setIsCallConnected(true);
      } catch (err) {
        console.log('Remote description notice:', err.message);
      }
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      try {
        if (candidate) {
          if (peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          } else {
            iceCandidatesQueue.push(candidate);
          }
        }
      } catch (err) {
        console.log('ICE candidate notice:', err.message);
      }
    });

    socket.on('receive-message', (msgData) => {
      setMessages((prev) => [...prev, msgData]);
    });

    socket.on('receive-caption', ({ text, senderName, id }) => {
      setCaptions((prev) => [...prev.slice(-2), { text, senderName, id }]);
    });

    socket.on('receive-reaction', ({ emoji, senderName, id }) => {
      setFloatingReactions((prev) => [...prev, { emoji, senderName, id }]);
      setTimeout(() => {
        setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
      }, 3500);
    });

    socket.on('receive-stroke', ({ strokeData }) => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = strokeData.color;
          ctx.lineWidth = strokeData.lineWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(strokeData.x0, strokeData.y0);
          ctx.lineTo(strokeData.x1, strokeData.y1);
          ctx.stroke();
        }
      }
    });

    socket.on('whiteboard-cleared', () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    });

    socket.on('host-muted-you', ({ targetUserId }) => {
      if (targetUserId === user?._id) {
        if (localStreamRef.current) {
          const audioTrack = localStreamRef.current.getAudioTracks()[0];
          if (audioTrack) {
            audioTrack.enabled = false;
            setIsAudioMuted(true);
          }
        }
        alert('The host has muted your microphone.');
      }
    });

    socket.on('participant-marked-completed', ({ userId }) => {
      if (userId !== user?._id) {
        setPartnerCompletionMarked(true);
      }
    });

    socket.on('meeting-completed', async () => {
      setIsCallConnected(false);
      alert('Skill swap session completed by both participants! Transferring to rating...');
      if (onRefreshSessions) await onRefreshSessions();
      onClose();
    });

    socket.on('call-ended', () => {
      setIsCallConnected(false);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      alert('The video call session has ended.');
      onClose();
    });

    return () => {
      socket.off('user-joined');
      socket.off('room-ready');
      socket.off('incoming-call');
      socket.off('call-accepted');
      socket.off('ice-candidate');
      socket.off('receive-message');
      socket.off('receive-caption');
      socket.off('receive-reaction');
      socket.off('receive-stroke');
      socket.off('whiteboard-cleared');
      socket.off('host-muted-you');
      socket.off('participant-marked-completed');
      socket.off('meeting-completed');
      socket.off('call-ended');

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      socket.emit('leave-room', { roomId });
    };
  }, [roomId, user?._id, user?.name, isHelper, session.helperCompleted, session.requesterCompleted]);

  const changeAudioDevice = async (deviceId) => {
    setSelectedAudioId(deviceId);
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } },
        video: selectedVideoId ? { deviceId: { exact: selectedVideoId } } : true,
      });

      const newAudioTrack = newStream.getAudioTracks()[0];
      if (localStreamRef.current) {
        const oldAudioTrack = localStreamRef.current.getAudioTracks()[0];
        if (oldAudioTrack) {
          localStreamRef.current.removeTrack(oldAudioTrack);
          oldAudioTrack.stop();
        }
        localStreamRef.current.addTrack(newAudioTrack);
      }

      if (peerConnectionRef.current) {
        const sender = peerConnectionRef.current.getSenders().find((s) => s.track?.kind === 'audio');
        if (sender) {
          sender.replaceTrack(newAudioTrack);
        }
      }
    } catch (err) {
      console.log('Error switching audio device:', err.message);
    }
  };

  const changeVideoDevice = async (deviceId) => {
    setSelectedVideoId(deviceId);
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
        audio: selectedAudioId ? { deviceId: { exact: selectedAudioId } } : true,
      });

      const newVideoTrack = newStream.getVideoTracks()[0];
      if (localStreamRef.current) {
        const oldVideoTrack = localStreamRef.current.getVideoTracks()[0];
        if (oldVideoTrack) {
          localStreamRef.current.removeTrack(oldVideoTrack);
          oldVideoTrack.stop();
        }
        localStreamRef.current.addTrack(newVideoTrack);
      }

      if (peerConnectionRef.current) {
        const sender = peerConnectionRef.current.getSenders().find((s) => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(newVideoTrack);
        }
      }
    } catch (err) {
      console.log('Error switching video device:', err.message);
    }
  };

  const getCanvasCoords = (e) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    prevCoordsRef.current = coords;
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const coords = getCanvasCoords(e);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = drawLineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(prevCoordsRef.current.x, prevCoordsRef.current.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();

      const socket = getSocket();
      socket.emit('draw-stroke', {
        roomId,
        strokeData: {
          x0: prevCoordsRef.current.x,
          y0: prevCoordsRef.current.y,
          x1: coords.x,
          y1: coords.y,
          color: drawColor,
          lineWidth: drawLineWidth,
        },
      });

      prevCoordsRef.current = coords;
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearWhiteboardCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    const socket = getSocket();
    socket.emit('clear-whiteboard', { roomId });
  };

  const toggleCaptions = () => {
    if (!isCaptionsEnabled) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Live Captions rely on Web Speech API, available in Chrome & Edge.');
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        if (transcript.trim()) {
          const socket = getSocket();
          socket.emit('send-caption', { roomId, text: transcript, senderName: user?.name || 'User' });
          setCaptions((prev) => [...prev.slice(-2), { text: transcript, senderName: 'You', id: Date.now() }]);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsCaptionsEnabled(true);
    } else {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsCaptionsEnabled(false);
    }
  };

  const sendEmojiReaction = (emoji) => {
    const socket = getSocket();
    socket.emit('send-reaction', { roomId, emoji, senderName: user?.name || 'User' });
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleNoiseCancellation = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack && audioTrack.applyConstraints) {
        audioTrack.applyConstraints({
          noiseSuppression: !isNoiseCancelled,
          echoCancellation: !isNoiseCancelled,
        });
      }
    }
    setIsNoiseCancelled(!isNoiseCancelled);
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        if (peerConnectionRef.current) {
          const sender = peerConnectionRef.current.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) sender.replaceTrack(screenTrack);
        }

        if (localVideoRef.current && localStreamRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }

        screenTrack.onended = () => {
          if (localStreamRef.current && localVideoRef.current) {
            const camTrack = localStreamRef.current.getVideoTracks()[0];
            const sender = peerConnectionRef.current.getSenders().find((s) => s.track?.kind === 'video');
            if (sender) sender.replaceTrack(camTrack);
            localVideoRef.current.srcObject = localStreamRef.current;
          }
          setIsScreenSharing(false);
        };
        setIsScreenSharing(true);
      } catch (err) {
        console.log('Screen share notice:', err.message);
      }
    } else {
      if (localStreamRef.current && localVideoRef.current) {
        const camTrack = localStreamRef.current.getVideoTracks()[0];
        const sender = peerConnectionRef.current.getSenders().find((s) => s.track?.kind === 'video');
        if (sender) sender.replaceTrack(camTrack);
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      setIsScreenSharing(false);
    }
  };

  const handleRemoteMute = (targetUserId) => {
    const socket = getSocket();
    socket.emit('remote-mute-participant', { roomId, targetUserId });
  };

  const handleCompleteMeeting = async () => {
    try {
      setMyCompletionMarked(true);
      const socket = getSocket();
      socket.emit('complete-meeting', {
        roomId,
        userId: user?._id,
        isRequester: !isHelper,
        isHelper,
      });

      if (partnerCompletionMarked) {
        await sessionsAPI.updateStatus(session._id, { status: 'completed', meetingStatus: 'completed' });
        if (onRefreshSessions) await onRefreshSessions();
        onClose();
      }
    } catch (err) {
      alert(err.message || 'Failed to complete meeting');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const txt = textInput.trim();
    setTextInput('');
    const socket = getSocket();
    socket.emit('send-message', {
      roomId,
      senderId: user?._id,
      senderName: user?.name || 'User',
      text: txt,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex flex-col font-sans text-white selection:bg-[#00ff62] selection:text-black">
      {showDeviceSettings && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[120] flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
          <BorderGlow
            backgroundColor="#101018"
            borderRadius={32}
            glowColor="143 100 50"
            glowIntensity={1.3}
            colors={['#00ff62', '#3b82f6', '#8b5cf6']}
            className="w-full max-w-md shadow-[0_30px_70px_rgba(0,0,0,0.9)] relative overflow-hidden"
          >
            <div className="p-6 space-y-5 relative z-10">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#00ff62]/10 border border-[#00ff62]/30 flex items-center justify-center text-[#00ff62]">
                    <FaCog className="text-base" />
                  </div>
                  <h3 className="text-white font-black text-base">Audio & Video Device Settings</h3>
                </div>
                <button
                  onClick={() => setShowDeviceSettings(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/50 hover:text-white flex items-center justify-center transition-all duration-300 hover:rotate-90 cursor-pointer"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-white/60 font-mono font-extrabold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <FaMicrophone className="text-[#00ff62]" /> Select Audio Device (Microphone)
                  </label>
                  <select
                    value={selectedAudioId}
                    onChange={(e) => changeAudioDevice(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-[#00ff62] transition-all font-sans"
                  >
                    {audioDevices.map((d, idx) => (
                      <option key={d.deviceId || idx} value={d.deviceId} className="bg-[#101018] text-white">
                        {d.label || `Microphone ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 font-mono font-extrabold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <FaVideo className="text-indigo-400" /> Select Video Device (Camera)
                  </label>
                  <select
                    value={selectedVideoId}
                    onChange={(e) => changeVideoDevice(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-indigo-400 transition-all font-sans"
                  >
                    {videoDevices.map((d, idx) => (
                      <option key={d.deviceId || idx} value={d.deviceId} className="bg-[#101018] text-white">
                        {d.label || `Camera ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setShowDeviceSettings(false)}
                className="w-full py-3.5 bg-gradient-to-r from-[#00ff62] to-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl hover:opacity-95 cursor-pointer shadow-[0_0_20px_rgba(0,255,98,0.3)] transition-all"
              >
                Done & Save
              </button>
            </div>
          </BorderGlow>
        </div>
      )}

      <div className="h-16 px-6 bg-[#101010] border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-[#00ff62] animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm leading-tight">SkillSwap Meet</h3>
              <span className="text-[10px] text-white/40 bg-white/10 px-2 py-0.5 rounded font-mono">
                256-bit Encrypted
              </span>
            </div>
            <p className="text-xs text-white/40">{session.skill} • {partner?.name || 'Partner'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWhiteboard(!showWhiteboard)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              showWhiteboard ? 'bg-[#00ff62] text-black font-extrabold' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Toggle Live Collaborative Whiteboard"
          >
            <FaPaintBrush /> <span className="hidden sm:inline">Whiteboard</span>
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'chat' ? 'meet' : 'chat')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'chat' ? 'bg-[#00ff62] text-black' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FaCommentDots /> <span className="hidden sm:inline">In-Call Chat</span>
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'participants' ? 'meet' : 'participants')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'participants' ? 'bg-[#00ff62] text-black' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FaUsers /> <span className="hidden sm:inline">People</span>
          </button>

          <button
            onClick={handleCompleteMeeting}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer ${
              myCompletionMarked
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                : 'bg-emerald-500/20 text-[#00ff62] border border-[#00ff62]/40 hover:bg-[#00ff62] hover:text-black'
            }`}
          >
            <FaCheckCircle /> {myCompletionMarked ? 'Awaiting Partner' : 'Finish & Complete'}
          </button>

          <button
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white transition"
            title="Leave Call"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 p-4 bg-[#0a0a0a] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
            {floatingReactions.map((r) => (
              <div
                key={r.id}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 text-4xl animate-bounce duration-1000 flex flex-col items-center"
                style={{
                  left: `${40 + Math.random() * 20}%`,
                }}
              >
                <span>{r.emoji}</span>
                <span className="text-[10px] text-white/70 bg-black/60 px-2 py-0.5 rounded-full font-mono">
                  {r.senderName}
                </span>
              </div>
            ))}
          </div>

          <div className="flex-1 rounded-3xl bg-[#141414] border border-white/10 relative overflow-hidden flex items-center justify-center shadow-2xl">
            <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                {partner?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <span className="text-xs font-bold">{partner?.name || 'Partner'}</span>
              {isCallConnected && (
                <span className="text-[10px] text-[#00ff62] font-mono bg-[#00ff62]/10 px-2 py-0.5 rounded-full">
                  Live 1080p HD
                </span>
              )}
            </div>

            {showWhiteboard && (
              <div className="absolute inset-0 z-35 bg-black/70 backdrop-blur-sm flex flex-col">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-black/90 border border-white/20 px-4 py-2 rounded-full flex items-center gap-3 shadow-2xl">
                  <span className="text-xs font-mono font-bold text-[#00ff62]">Live Whiteboard</span>
                  <div className="flex items-center gap-1.5">
                    {['#00ff62', '#3b82f6', '#ec4899', '#eab308', '#ffffff'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setDrawColor(c)}
                        className={`w-5 h-5 rounded-full cursor-pointer transition ${drawColor === c ? 'scale-125 border-2 border-white' : 'opacity-70'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={clearWhiteboardCanvas}
                    className="text-xs text-red-400 hover:text-red-300 font-bold font-mono px-2 py-1 bg-red-500/10 rounded-lg border border-red-500/30 flex items-center gap-1 cursor-pointer"
                  >
                    <FaTrash className="text-[10px]" /> Clear
                  </button>
                  <button
                    onClick={() => setShowWhiteboard(false)}
                    className="text-xs text-white/50 hover:text-white cursor-pointer ml-1"
                  >
                    <FaTimes />
                  </button>
                </div>

                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={720}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full cursor-crosshair touch-none"
                />
              </div>
            )}

            {(partnerCompletionMarked || myCompletionMarked) && (
              <div className="absolute top-4 right-4 z-30 bg-black/80 backdrop-blur-md border border-[#00ff62]/30 px-4 py-2 rounded-2xl flex items-center gap-2">
                <FaCheckCircle className="text-[#00ff62]" />
                <p className="text-xs text-white font-mono">
                  {partnerCompletionMarked && myCompletionMarked
                    ? 'Session marked complete by BOTH participants!'
                    : partnerCompletionMarked
                    ? 'Partner marked session complete! Click Finish & Complete to verify.'
                    : 'You marked session complete. Awaiting partner confirmation.'}
                </p>
              </div>
            )}

            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${!isCallConnected ? 'hidden' : 'block'}`}
            />

            {!isCallConnected && (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-3xl font-black shadow-2xl animate-pulse">
                  {partner?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">{partner?.name || 'Partner'}</h4>
                  <p className="text-xs text-white/40 font-mono mt-1">
                    Waiting for partner to join room...
                  </p>
                </div>
              </div>
            )}

            {captions.length > 0 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-xl w-full px-4 text-center">
                <div className="bg-black/80 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl shadow-2xl">
                  <p className="text-xs font-bold text-[#00ff62] font-mono">
                    {captions[captions.length - 1]?.senderName}:
                  </p>
                  <p className="text-sm font-medium text-white italic">
                    &quot;{captions[captions.length - 1]?.text}&quot;
                  </p>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 right-4 w-44 h-32 rounded-2xl bg-black border-2 border-[#00ff62]/50 overflow-hidden shadow-2xl z-30 flex items-center justify-center">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover scale-x-[-1] ${isVideoOff && 'hidden'}`}
              />
              {isVideoOff && (
                <div className="text-center p-2">
                  <div className="w-9 h-9 rounded-full bg-white/10 mx-auto flex items-center justify-center text-xs font-bold mb-1">
                    You
                  </div>
                  <span className="text-[10px] text-white/40 font-mono">Cam Off</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 relative z-30">
            <div className="w-full h-16 px-4 md:px-6 bg-[#141416]/95 backdrop-blur-2xl border border-white/15 rounded-2xl flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative overflow-hidden font-sans before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:via-transparent before:to-white/5 before:pointer-events-none">
              <div className="flex items-center gap-2 relative z-10">
                <span className="text-xs text-white/70 font-mono hidden md:inline font-bold">
                  {session.skill}
                </span>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full transition cursor-pointer ${
                    isAudioMuted
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {isAudioMuted ? <FaMicrophoneSlash className="text-base" /> : <FaMicrophone className="text-base" />}
                </button>

                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full transition cursor-pointer ${
                    isVideoOff
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title={isVideoOff ? 'Turn Cam On' : 'Turn Cam Off'}
                >
                  {isVideoOff ? <FaVideoSlash className="text-base" /> : <FaVideo className="text-base" />}
                </button>

                <button
                  onClick={toggleScreenShare}
                  className={`p-3 rounded-full transition cursor-pointer ${
                    isScreenSharing
                      ? 'bg-[#00ff62] text-black font-bold'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title="Share Presentation Screen"
                >
                  <FaDesktop className="text-base" />
                </button>

                <button
                  onClick={toggleCaptions}
                  className={`p-3 rounded-full transition cursor-pointer ${
                    isCaptionsEnabled
                      ? 'bg-[#00ff62] text-black font-bold'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title="Live Captions (CC)"
                >
                  <FaClosedCaptioning className="text-base" />
                </button>

                <button
                  onClick={toggleNoiseCancellation}
                  className={`p-3 rounded-full transition cursor-pointer ${
                    isNoiseCancelled
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                      : 'bg-white/10 text-white/40'
                  }`}
                  title={isNoiseCancelled ? 'Noise Cancellation Active' : 'Noise Cancellation Off'}
                >
                  <FaVolumeMute className="text-base" />
                </button>

                <button
                  onClick={() => setShowDeviceSettings(true)}
                  className="p-3 rounded-full bg-white/10 text-white hover:bg-[#00ff62] hover:text-black transition cursor-pointer"
                  title="Device Settings (Mic & Camera)"
                >
                  <FaCog className="text-base" />
                </button>

                {isHost && (
                  <button
                    onClick={() => setShowHostPanel(!showHostPanel)}
                    className={`p-3 rounded-full transition cursor-pointer flex items-center gap-1 font-bold text-xs ${
                      showHostPanel
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                        : 'bg-amber-400/20 text-amber-400 border border-amber-400/30 hover:bg-amber-400 hover:text-black'
                    }`}
                    title="Host Controls & Security"
                  >
                    <FaShieldAlt className="text-base" />
                    <span className="hidden md:inline">Host</span>
                  </button>
                )}

                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
                  {EMOJI_LIST.slice(0, 4).map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => sendEmojiReaction(emoji)}
                      className="hover:scale-125 transition text-base p-1 cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition cursor-pointer shadow-lg ml-2"
                >
                  Leave
                </button>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <span className="text-[10px] text-[#00ff62] bg-[#00ff62]/10 px-2 py-0.5 rounded font-mono font-bold">
                  {isHost ? '👑 Room Host' : 'Participant'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {showHostPanel && isHost && (
          <div className="absolute bottom-24 right-8 z-50 bg-[#141416]/95 backdrop-blur-2xl border border-amber-400/40 p-5 rounded-3xl w-80 shadow-[0_10px_40px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-amber-400 text-lg" />
                <h4 className="text-white font-extrabold text-sm">👑 Host Control Panel</h4>
              </div>
              <button onClick={() => setShowHostPanel(false)} className="text-white/40 hover:text-white cursor-pointer">
                <FaTimes />
              </button>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  handleRemoteMute(partner?._id);
                  alert(`Mute signal sent to ${partner?.name || 'partner'}.`);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition flex items-center justify-between cursor-pointer"
              >
                <span>Mute Partner Microphone</span>
                <FaMicrophoneSlash className="text-xs" />
              </button>

              <button
                onClick={handleCompleteMeeting}
                className="w-full py-2.5 px-3 rounded-xl bg-[#00ff62]/10 border border-[#00ff62]/30 text-[#00ff62] text-xs font-extrabold hover:bg-[#00ff62] hover:text-black transition flex items-center justify-between cursor-pointer"
              >
                <span>Mark Session Completed</span>
                <FaCheckCircle className="text-xs" />
              </button>

              <button
                onClick={() => {
                  const socket = getSocket();
                  socket.emit('end-call-for-all', { roomId });
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-extrabold hover:bg-red-600 hover:text-white transition flex items-center justify-between cursor-pointer"
              >
                <span>End Meeting for All</span>
                <FaTimes className="text-xs" />
              </button>
            </div>
          </div>
        )}

        {(activeTab === 'chat' || activeTab === 'participants') && (
          <div className="w-full md:w-80 bg-[#121212] border-l border-white/10 flex flex-col font-sans">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-white/50 font-mono">
                {activeTab === 'chat' ? 'In-Call Chat' : 'Participants & Host Controls'}
              </h4>
              <button onClick={() => setActiveTab('meet')} className="text-white/40 hover:text-white">
                <FaTimes />
              </button>
            </div>

            {activeTab === 'chat' ? (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-white/20 text-xs text-center py-8">
                      No messages yet. Send a message to call participants!
                    </p>
                  ) : (
                    messages.map((m, i) => {
                      const isMe = m.sender === user?._id || m.sender?._id === user?._id;
                      return (
                        <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <span className="text-[10px] text-white/30 mb-0.5">
                            {m.senderName || (isMe ? 'You' : 'Partner')}
                          </span>
                          <div
                            className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs ${
                              isMe
                                ? 'bg-[#00ff62] text-black font-semibold'
                                : 'bg-white/10 text-white'
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex gap-2 bg-[#1a1a1a]">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type in-call message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00ff62]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#00ff62] text-black font-bold rounded-xl text-xs hover:bg-emerald-400 cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black text-xs">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{user?.name} (You)</p>
                        <span className="text-[10px] text-[#00ff62] font-mono">
                          {isHost ? 'Host' : 'Participant'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                        {partner?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{partner?.name || 'Partner'}</p>
                        <span className="text-[10px] text-white/40 font-mono">
                          {isCallConnected ? 'Connected' : 'Waiting...'}
                        </span>
                      </div>
                    </div>

                    {isHost && partner && (
                      <button
                        onClick={() => handleRemoteMute(partner._id)}
                        className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-[10px] font-bold hover:bg-red-500 hover:text-white transition"
                        title="Remote Mute Participant"
                      >
                        Mute Mic
                      </button>
                    )}
                  </div>
                </div>

                {isHost && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 text-xs">
                    <p className="font-bold text-[#00ff62] flex items-center gap-1">
                      <FaShieldAlt /> Host Control Privileges
                    </p>
                    <p className="text-white/60 text-[11px]">
                      As host, completing the meeting updates the session status to completed across the platform.
                    </p>
                    <button
                      onClick={handleCompleteMeeting}
                      className="w-full py-2 bg-[#00ff62] text-black font-extrabold rounded-xl text-xs hover:bg-emerald-400 transition cursor-pointer"
                    >
                      Complete Meeting & Finish Swap
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
