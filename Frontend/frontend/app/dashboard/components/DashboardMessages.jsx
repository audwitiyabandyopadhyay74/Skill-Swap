'use client';
import React, { useState, useEffect, useRef } from 'react';
import { messagesAPI, usersAPI } from '../../lib/api';
import { getSocket } from '../../lib/socket';
import {
  FaPaperclip,
  FaPaperPlane,
  FaSearch,
  FaFileAlt,
  FaDownload,
  FaComments,
  FaCode,
  FaTimes,
  FaCircle,
  FaUserPlus,
  FaUserCheck,
  FaStar,
  FaFolder,
  FaBolt,
  FaPen,
} from 'react-icons/fa';

export default function DashboardMessages({ user, initialTargetUser, onNavigate }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchMember, setSearchMember] = useState('');
  const [memberResults, setMemberResults] = useState([]);
  const [activeTab, setActiveTab] = useState('chat'); 
  const [collaborativeNotes, setCollaborativeNotes] = useState('');
  const [typingUser, setTypingUser] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getPartnerFromConvo = (c) => {
    if (!c) return null;
    if (c.partner) return c.partner;
    if (c.participants) {
      return c.participants.find((p) => (p._id || p) !== user?._id) || c.participants[0];
    }
    return null;
  };

  const fetchConversations = async () => {
    try {
      const data = await messagesAPI.getConversations();
      const list = data.conversations || [];
      setConversations(list);

      if (initialTargetUser) {
        const existing = list.find((c) => {
          const p = getPartnerFromConvo(c);
          return p && (p._id === initialTargetUser._id || p === initialTargetUser._id);
        });
        if (existing) {
          setActiveConversation(existing);
        } else {
          setActiveConversation({
            partner: initialTargetUser,
            isTemp: true,
          });
        }
      } else if (list.length > 0) {
        setActiveConversation((prev) => prev || list[0]);
      }
    } catch (err) {
      console.log('Conversations notice:', err.message);
    } finally {
      setLoadingConvos(false);
    }
  };

  const fetchThread = async (convo) => {
    if (!convo || convo.isTemp) {
      setMessages([]);
      return;
    }
    const partner = getPartnerFromConvo(convo);
    const partnerId = partner?._id || partner;
    if (!partnerId) return;

    setLoadingMessages(true);
    try {
      const data = await messagesAPI.getMessages(partnerId);
      setMessages(data.messages || []);
    } catch (err) {
      console.log('Thread notice:', err.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const currentPartnerId = getPartnerFromConvo(activeConversation)?._id || activeConversation?.partner?._id;

  useEffect(() => {
    if (activeConversation) {
      fetchThread(activeConversation);
    }
  }, [currentPartnerId]);

  useEffect(() => {
    if (!user?._id) return;
    const socket = getSocket();
    socket.emit('join-user-room', { userId: user._id });

    const handleDirectMessage = (msgData) => {
      if (!msgData) return;
      const currentPartner = getPartnerFromConvo(activeConversation);
      const activePartnerId = (currentPartner?._id || currentPartner || '').toString();
      const senderId = (msgData.sender?._id || msgData.sender || '').toString();
      const recipientId = (msgData.recipient?._id || msgData.recipient || '').toString();
      const currentUserId = (user?._id || '').toString();

      const isForActiveThread =
        (senderId === activePartnerId && (recipientId === currentUserId || !recipientId)) ||
        (senderId === currentUserId && recipientId === activePartnerId);

      if (isForActiveThread) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msgData._id || (m.text === msgData.text && Math.abs(new Date(m.createdAt) - new Date(msgData.createdAt)) < 2000))) {
            return prev;
          }
          return [...prev, msgData];
        });
      }
      fetchConversations();
    };

    const handleTyping = ({ senderId }) => {
      const currentPartner = getPartnerFromConvo(activeConversation);
      const activePartnerId = (currentPartner?._id || currentPartner || '').toString();
      if (activePartnerId && activePartnerId === (senderId || '').toString()) {
        setTypingUser(currentPartner.name);
        setTimeout(() => setTypingUser(null), 3000);
      }
    };

    socket.on('receive-direct-message', handleDirectMessage);
    socket.on('typing-direct-message', handleTyping);

    return () => {
      socket.off('receive-direct-message', handleDirectMessage);
      socket.off('typing-direct-message', handleTyping);
    };
  }, [user?._id, activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const searchInputRef = useRef(null);

  const openMemberSearch = async () => {
    searchInputRef.current?.focus();
    try {
      const data = await usersAPI.browse(searchMember ? { search: searchMember } : {});
      setMemberResults(data.users?.filter((u) => u._id !== user?._id) || []);
    } catch (err) {
      console.log('Member directory notice:', err.message);
    }
  };

  useEffect(() => {
    if (!searchMember.trim()) {
      setMemberResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const data = await usersAPI.browse({ search: searchMember });
        setMemberResults(data.users?.filter((u) => u._id !== user?._id) || []);
      } catch (err) {
        console.log('Member search notice:', err.message);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchMember, user?._id]);

  const handleStartChatWith = (targetMember) => {
    const existing = conversations.find((c) => {
      const p = getPartnerFromConvo(c);
      return p && (p._id === targetMember._id || p === targetMember._id);
    });
    if (existing) {
      setActiveConversation(existing);
    } else {
      setActiveConversation({
        partner: targetMember,
        isTemp: true,
      });
    }
    setSearchMember('');
    setMemberResults([]);
  };

  const handleSendMessage = async (e, customFileData = null) => {
    if (e) e.preventDefault();
    if ((!text.trim() && !customFileData) || !activeConversation) return;

    const partner = getPartnerFromConvo(activeConversation);
    const partnerId = partner?._id || partner;
    if (!partnerId) return;

    const msgText = text.trim();
    setText('');

    try {
      const data = await messagesAPI.sendMessage(partnerId, msgText, customFileData);
      const sentMsg = data.message || data.messageData;

      if (sentMsg) {
        setMessages((prev) => [...prev, sentMsg]);
      }

      if (activeConversation.isTemp) {
        setActiveConversation({
          partner: partner,
          isTemp: false,
        });
      }
      fetchConversations();

      const socket = getSocket();
      socket.emit('send-direct-message', {
        senderId: user?._id,
        recipientId: partnerId,
        messageData: sentMsg,
      });
    } catch (err) {
      console.log('Send message notice:', err.message);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const fileData = {
        fileName: file.name,
        fileType: file.type,
        fileUrl: reader.result,
        fileSize: (file.size / 1024).toFixed(1) + ' KB',
      };
      handleSendMessage(null, fileData);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    const partner = getPartnerFromConvo(activeConversation);
    const partnerId = partner?._id || partner;
    if (partnerId) {
      const socket = getSocket();
      socket.emit('typing-direct-message', {
        recipientId: partnerId,
        senderId: user?._id,
      });
    }
  };

  const activePartner = getPartnerFromConvo(activeConversation);
  const cleanPartnerName = activePartner?.name
    ? activePartner.name.includes('@')
      ? activePartner.name.split('@')[0]
      : activePartner.name
    : 'Select Member';

  return (
    <div className="p-4 md:p-8 font-sans h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-[#121217]/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl flex-1 flex flex-col md:flex-row overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
        
        <div className="w-full md:w-80 bg-[#0c0c10]/95 border-r border-white/[0.08] flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
                <FaComments className="text-[#00ff62]" /> Direct Messages
              </h2>
              <span className="text-[10px] bg-[#00ff62]/10 text-[#00ff62] border border-[#00ff62]/30 px-2 py-0.5 rounded-full font-mono font-bold">
                Live Chat
              </span>
            </div>

            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-xs" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchMember}
                onFocus={openMemberSearch}
                onChange={(e) => setSearchMember(e.target.value)}
                placeholder="Search or select member to message..."
                className="w-full bg-[#181820] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white text-xs outline-none focus:border-[#00ff62]/50 placeholder:text-white/20 font-sans"
              />
            </div>

            {memberResults.length > 0 && (
              <div className="bg-[#181824] border border-[#00ff62]/30 rounded-xl p-2 max-h-60 overflow-y-auto space-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50">
                <div className="flex items-center justify-between px-2 py-1 border-b border-white/10 mb-1">
                  <p className="text-[10px] text-[#00ff62] uppercase font-mono font-bold">Select Member to Chat</p>
                  <button onClick={() => setMemberResults([])} className="text-white/40 hover:text-white text-xs cursor-pointer">
                    <FaTimes />
                  </button>
                </div>
                {memberResults.map((m) => (
                  <div
                    key={m._id}
                    onClick={() => handleStartChatWith(m)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#00ff62]/10 hover:border-[#00ff62]/30 border border-transparent cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 via-indigo-500 to-purple-600 p-[1px] flex-shrink-0">
                        <div className="w-full h-full rounded-full bg-[#121216] flex items-center justify-center font-bold text-white text-[11px]">
                          {m.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-white font-bold truncate">{m.name}</p>
                        <p className="text-[10px] text-white/40 truncate font-mono">{m.skillsOffered?.join(', ') || m.email || 'Member'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#00ff62]/20 text-[#00ff62] border border-[#00ff62]/40 px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                      + Start Chat
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loadingConvos ? (
              <div className="space-y-2 p-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-10 p-4 text-white/40 text-xs space-y-3">
                <p className="font-bold text-white/60">No direct conversations yet</p>
                <p className="text-[11px] text-white/30">
                  Click below to open member list and start chatting!
                </p>
                <button
                  onClick={openMemberSearch}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#00ff62]/10 border border-[#00ff62]/30 text-[#00ff62] font-black text-xs hover:bg-[#00ff62] hover:text-black transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FaUserPlus /> Connect with People
                </button>
              </div>
            ) : (
              conversations.map((convo, idx) => {
                const partner = getPartnerFromConvo(convo);
                const partnerId = partner?._id || partner;
                const partnerName = partner?.name ? (partner.name.includes('@') ? partner.name.split('@')[0] : partner.name) : 'Member';
                const activePartnerId = getPartnerFromConvo(activeConversation)?._id || activeConversation?.partner?._id;
                const isActive = activePartnerId === partnerId;

                const lastMsgObj = convo.lastMessage;
                const lastMsgText = typeof lastMsgObj === 'string'
                  ? lastMsgObj
                  : (lastMsgObj?.text || (lastMsgObj?.fileData ? '📎 File Attachment' : 'Click to view conversation'));
                const lastMsgTime = convo.lastMessageAt || lastMsgObj?.createdAt;

                return (
                  <div
                    key={convo._id || partnerId || `convo-${idx}`}
                    onClick={() => setActiveConversation(convo)}
                    className={`p-3 rounded-2xl flex items-center gap-3 transition cursor-pointer relative group ${
                      isActive
                        ? 'bg-gradient-to-r from-[#00ff62]/20 via-[#00ff62]/10 to-transparent border border-[#00ff62]/40 shadow-[0_0_15px_rgba(0,255,98,0.15)]'
                        : 'hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 via-indigo-500 to-purple-600 p-[1.5px]">
                        <div className="w-full h-full rounded-full bg-[#121216] flex items-center justify-center font-bold text-white text-xs">
                          {partnerName[0]?.toUpperCase() || '?'}
                        </div>
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00ff62] border-2 border-[#0c0c10] rounded-full" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-extrabold text-xs truncate ${isActive ? 'text-[#00ff62]' : 'text-white'}`}>
                          {partnerName}
                        </h4>
                        {lastMsgTime && (
                          <span className="text-[9px] font-mono text-white/30">
                            {new Date(lastMsgTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/40 truncate mt-0.5">
                        {lastMsgText}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {activeConversation ? (
          <div className="flex-1 flex flex-col bg-[#101014]/80">
            <div className="p-4 border-b border-white/[0.08] bg-[#14141a]/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-xs shadow-md">
                    {cleanPartnerName[0]?.toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00ff62] border-2 border-[#14141a] rounded-full shadow-[0_0_8px_rgba(0,255,98,0.8)]" />
                </div>

                <div>
                  <h3 className="text-white font-black text-base flex items-center gap-2">
                    {cleanPartnerName}
                  </h3>
                  <p className="text-[10px] font-mono text-[#00ff62] flex items-center gap-1">
                    {typingUser ? (
                      <>
                        <FaPen className="animate-pulse" /> {typingUser} is typing...
                      </>
                    ) : (
                      <>
                        <FaBolt /> Active Direct Connection
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'chat' ? 'bg-[#00ff62] text-black shadow-md' : 'text-white/40 hover:text-white'
                  }`}
                >
                  Chat Thread
                </button>
                <button
                  onClick={() => setActiveTab('canvas')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    activeTab === 'canvas' ? 'bg-[#00ff62] text-black shadow-md' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <FaCode /> Shared Canvas
                </button>
              </div>
            </div>

            {activeTab === 'chat' ? (
              <>
                <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-3">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full text-white/30 font-mono text-xs">
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-20 text-white/30 text-xs font-sans space-y-2">
                      <p className="text-base font-bold text-white/60">Start a conversation with {cleanPartnerName}</p>
                      <p className="text-[11px] text-white/30 max-w-sm mx-auto">
                        Send messages, share links, or attach files to collaborate on skill swaps.
                      </p>
                    </div>
                  ) : (
                    messages.map((m, i) => {
                      const isMe = m.sender?._id === user?._id || m.sender === user?._id;
                      const hasFile = !!m.fileData;
                      const isImage = hasFile && m.fileData.fileType?.startsWith('image/');

                      return (
                        <div key={m._id || `msg-${i}-${m.createdAt || Date.now()}`} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <span className="text-[9px] font-mono text-white/30 mb-0.5 px-1">
                            {isMe ? 'You' : cleanPartnerName} • {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          <div
                            className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl text-xs leading-relaxed flex flex-col gap-2 ${
                              isMe
                                ? 'bg-gradient-to-r from-[#00ff62] to-emerald-400 text-black font-semibold shadow-[0_4px_20px_rgba(0,255,98,0.25)] rounded-tr-none'
                                : 'bg-white/10 text-white border border-white/10 rounded-tl-none'
                            }`}
                          >
                            {m.text && <span>{m.text}</span>}

                            {hasFile && (
                              <div className="bg-black/40 p-3 rounded-xl border border-white/10 flex flex-col gap-2 mt-1">
                                {isImage ? (
                                  <img
                                    src={m.fileData.fileUrl}
                                    alt={m.fileData.fileName}
                                    className="max-h-48 rounded-lg object-cover w-full border border-white/10"
                                  />
                                ) : (
                                  <div className="flex items-center gap-2.5">
                                    <FaFileAlt className="text-xl flex-shrink-0 text-[#00ff62]" />
                                    <div className="min-w-0 flex-1">
                                      <p className="font-bold truncate text-xs">{m.fileData.fileName}</p>
                                      <p className="text-[9px] font-mono opacity-60">{m.fileData.fileSize}</p>
                                    </div>
                                  </div>
                                )}
                                <a
                                  href={m.fileData.fileUrl}
                                  download={m.fileData.fileName}
                                  className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                                    isMe
                                      ? 'bg-black text-[#00ff62] hover:bg-black/80'
                                      : 'bg-[#00ff62] text-black hover:bg-emerald-400'
                                  }`}
                                >
                                  <FaDownload /> Download File
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/[0.08] bg-[#14141a]/90 flex items-center gap-2">
                  <label className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-[#00ff62] rounded-xl cursor-pointer transition">
                    <FaPaperclip />
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <input
                    type="text"
                    value={text}
                    onChange={handleInputChange}
                    placeholder={`Write a message to ${cleanPartnerName}...`}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#00ff62] placeholder:text-white/20 font-sans"
                  />

                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#00ff62] text-black font-black rounded-xl text-xs hover:bg-emerald-400 cursor-pointer shadow-[0_0_20px_rgba(0,255,98,0.35)] transition"
                  >
                    <FaPaperPlane />
                  </button>
                </form>
              </>
            ) : (
              
              <div className="flex-1 p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-extrabold text-sm">Shared Canvas & Code Workspace</h4>
                    <p className="text-white/40 text-xs mt-0.5">Draft notes, share links, or solve code exercises together</p>
                  </div>
                  <span className="text-[10px] text-[#00ff62] font-mono bg-[#00ff62]/10 px-3 py-1 rounded-full border border-[#00ff62]/30">
                    Shared Buffer
                  </span>
                </div>

                <textarea
                  value={collaborativeNotes}
                  onChange={(e) => setCollaborativeNotes(e.target.value)}
                  placeholder={`Write shared notes with ${cleanPartnerName} here...`}
                  className="flex-1 bg-[#0a0a0d] border border-white/10 rounded-2xl p-5 text-xs font-mono text-white outline-none focus:border-[#00ff62]/50 resize-none leading-relaxed shadow-inner"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-white/40 space-y-4 font-sans">
            <div className="w-20 h-20 rounded-3xl bg-[#00ff62]/10 border border-[#00ff62]/30 flex items-center justify-center text-[#00ff62] text-3xl shadow-[0_0_30px_rgba(0,255,98,0.2)] animate-pulse">
              <FaComments />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className="text-xl font-black text-white tracking-tight">Connect & Chat with People</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                Browse verified swappers in the Exchange Feed or search members above to initiate live direct messages and skill swaps.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={openMemberSearch}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00ff62] to-emerald-400 text-black font-black text-xs uppercase tracking-wider hover:opacity-95 transition-all cursor-pointer shadow-[0_0_25px_rgba(0,255,98,0.4)] flex items-center gap-2"
              >
                <FaUserPlus /> Find & Connect with People
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
