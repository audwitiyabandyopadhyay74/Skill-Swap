'use client';
import React, { useState, useEffect } from 'react';
import { sessionsAPI, postsAPI } from '../../lib/api';
import { getSocket } from '../../lib/socket';
import {
  FaHandshake,
  FaEnvelope,
  FaCheck,
  FaVideo,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaStar,
  FaComments,
  FaHistory,
  FaArrowRight,
  FaBolt,
} from 'react-icons/fa';

import ScheduleMeetModal from './ScheduleMeetModal';
import RatingModal from './RatingModal';
import SessionCalendar from './SessionCalendar';
import BorderGlow from '../../components/BorderGlow';

const STATUS_COLORS = {
  pending: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  accepted: 'text-[#00ff62] bg-[#00ff62]/10 border-[#00ff62]/30 shadow-[0_0_10px_rgba(0,255,98,0.15)]',
  completed: 'text-violet-400 bg-violet-400/10 border-violet-400/30',
  declined: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
};

export default function DashboardSessions({ user, onLaunchMeet, onOpenChat }) {
  const [subTab, setSubTab] = useState('active'); 
  const [sessions, setSessions] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleModalSession, setScheduleModalSession] = useState(null);
  const [ratingModalSession, setRatingModalSession] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [sessData, postData] = await Promise.all([
        sessionsAPI.list(),
        postsAPI.list({ author: user?._id }),
      ]);
      setSessions(sessData.sessions || []);
      setMyPosts(postData.posts || []);
    } catch (err) {
      console.log('Sessions fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user?._id]);

  useEffect(() => {
    const socket = getSocket();
    const handleUpdate = () => fetchAllData();
    socket.on('session-updated', handleUpdate);
    socket.on('proposal-received', handleUpdate);

    return () => {
      socket.off('session-updated', handleUpdate);
      socket.off('proposal-received', handleUpdate);
    };
  }, []);

  const handleAcceptProposal = async (postId, proposalId) => {
    try {
      await postsAPI.acceptProposal(postId, proposalId);
      fetchAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeclineProposal = async (postId, proposalId) => {
    try {
      await postsAPI.declineProposal(postId, proposalId);
      fetchAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCompleteSession = async (sessionId) => {
    try {
      const data = await sessionsAPI.complete(sessionId);
      setRatingModalSession(data.session || { _id: sessionId });
      fetchAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const activeSessions = sessions.filter((s) => s.status === 'accepted');
  const historySessions = sessions.filter((s) => s.status === 'completed' || s.status === 'declined');

  const pendingProposalsList = [];
  myPosts.forEach((post) => {
    (post.proposals || []).forEach((prop) => {
      if (prop.status === 'pending') {
        pendingProposalsList.push({ post, proposal: prop });
      }
    });
  });

  return (
    <div className="p-4 md:p-8 space-y-6 font-sans pb-36 md:pb-8 max-w-7xl mx-auto">
      <BorderGlow
        backgroundColor="#12121c"
        borderRadius={28}
        glowColor="143 100 50"
        glowIntensity={1.2}
        edgeSensitivity={30}
        colors={['#00ff62', '#10b981', '#6366f1']}
        className="p-6 md:p-7 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#00ff62]/15 text-[#00ff62] border border-[#00ff62]/30 text-[10px] font-mono font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,255,98,0.2)]">
                <FaBolt className="text-[10px]" /> Exchange Hub
              </span>
              <span className="text-white/30 text-xs font-mono">• {sessions.length} Total Swaps</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Sessions & Swap Requests
            </h1>
            <p className="text-white/50 text-xs max-w-lg">
              Manage your peer-to-peer live swap meetings, incoming requests, and session schedule.
            </p>
          </div>

          <div className="flex bg-[#0a0a0f] p-1.5 rounded-2xl border border-white/10 relative z-10 self-start md:self-auto shadow-inner">
            <button
              onClick={() => setSubTab('active')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                subTab === 'active'
                  ? 'bg-gradient-to-r from-[#00ff62] to-emerald-400 text-black shadow-[0_0_20px_rgba(0,255,98,0.35)] font-black'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaHandshake className="text-xs" />
              Active Swaps & Requests
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                subTab === 'active' ? 'bg-black/20 text-black' : 'bg-white/10 text-white/70'
              }`}>
                {activeSessions.length + pendingProposalsList.length}
              </span>
            </button>

            <button
              onClick={() => setSubTab('history')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                subTab === 'history'
                  ? 'bg-gradient-to-r from-[#00ff62] to-emerald-400 text-black shadow-[0_0_20px_rgba(0,255,98,0.35)] font-black'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaHistory className="text-xs" />
              Previous Swaps & History
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                subTab === 'history' ? 'bg-black/20 text-black' : 'bg-white/10 text-white/70'
              }`}>
                {historySessions.length}
              </span>
            </button>
          </div>
        </div>
      </BorderGlow>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-7 space-y-6">
          {subTab === 'active' ? (
            
            <div className="space-y-6">
              {pendingProposalsList.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-white font-black text-xs uppercase tracking-wider flex items-center gap-2">
                      <FaEnvelope className="text-[#00ff62]" /> Incoming Swap Requests ({pendingProposalsList.length})
                    </h3>
                    <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                      Needs Action
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {pendingProposalsList.map(({ post, proposal }) => {
                      const propUser = proposal.user;
                      const propName = propUser?.name
                        ? propUser.name.includes('@')
                          ? propUser.name.split('@')[0]
                          : propUser.name
                        : 'Member';

                      return (
                        <BorderGlow
                          key={proposal._id}
                          backgroundColor="#12121a"
                          borderRadius={24}
                          glowColor="40 90 60"
                          glowIntensity={1.1}
                          colors={['#f59e0b', '#00ff62', '#6366f1']}
                          className="p-5"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-[1.5px] shadow-md">
                                  <div className="w-full h-full rounded-[14px] bg-[#121216] flex items-center justify-center text-white font-black text-xs">
                                    {propName[0]?.toUpperCase() || '?'}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-white font-black text-sm">{propName}</h4>
                                  <p className="text-white/40 text-[11px] font-mono">{propUser?.email || ''}</p>
                                </div>
                              </div>

                              <span className="text-[10px] font-mono font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full uppercase">
                                Pending Request
                              </span>
                            </div>

                            <div className="bg-black/50 p-3.5 rounded-2xl border border-white/[0.06] space-y-1">
                              <p className="text-white/40 text-[10px] font-mono uppercase font-bold">Replying to exchange:</p>
                              <p className="text-[#00ff62] text-xs font-black truncate">&quot;{post.title}&quot;</p>
                              <p className="text-white/80 text-xs italic bg-white/[0.02] p-3 rounded-xl border border-white/5 mt-1.5">
                                &quot;{proposal.message}&quot;
                              </p>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                onClick={() => handleDeclineProposal(post._id, proposal._id)}
                                className="px-4 py-2 rounded-xl bg-white/10 text-white/70 font-bold text-xs hover:bg-rose-500/20 hover:text-rose-400 transition cursor-pointer flex items-center gap-1.5"
                              >
                                <FaTimes /> Decline
                              </button>
                              <button
                                onClick={() => handleAcceptProposal(post._id, proposal._id)}
                                className="px-4 py-2 rounded-xl bg-[#00ff62] text-black font-black text-xs hover:bg-emerald-400 transition cursor-pointer shadow-[0_0_15px_rgba(0,255,98,0.3)] flex items-center gap-1.5"
                              >
                                <FaCheck /> Accept Proposal
                              </button>
                            </div>
                          </div>
                        </BorderGlow>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-white font-black text-xs uppercase tracking-wider flex items-center gap-2">
                    <FaHandshake className="text-[#00ff62]" /> Active Confirmed Swaps ({activeSessions.length})
                  </h3>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="bg-[#12121c] border border-white/[0.06] rounded-3xl h-36 animate-pulse" />
                    ))}
                  </div>
                ) : activeSessions.length === 0 ? (
                  <div className="text-center py-14 bg-[#12121c]/80 border border-white/[0.06] rounded-3xl p-8 space-y-2 shadow-xl">
                    <FaHandshake className="text-4xl text-white/20 mx-auto mb-2" />
                    <p className="text-white/60 text-sm font-bold">No active confirmed swaps yet</p>
                    <p className="text-white/30 text-xs max-w-xs mx-auto">
                      Submit proposals in the Exchange Feed or accept pending requests above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {activeSessions.map((sess) => {
                      const isHelper = sess.helper?._id === user?._id || sess.helper === user?._id;
                      const partner = isHelper ? sess.requester : sess.helper;
                      const partnerName = partner?.name
                        ? partner.name.includes('@')
                          ? partner.name.split('@')[0]
                          : partner.name
                        : 'Swap Partner';

                      const isAgreed = sess.meetingStatus === 'scheduled';
                      const statusStyle = STATUS_COLORS[sess.status] || STATUS_COLORS.pending;

                      return (
                        <BorderGlow
                          key={sess._id}
                          backgroundColor="#12121c"
                          borderRadius={24}
                          glowColor="143 100 50"
                          glowIntensity={1.2}
                          colors={['#00ff62', '#10b981', '#6366f1']}
                          className="p-5 shadow-xl"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00ff62] via-emerald-500 to-indigo-600 p-[1.5px] shadow-md">
                                  <div className="w-full h-full rounded-[14px] bg-[#121216] flex items-center justify-center text-white font-black text-sm">
                                    {partnerName[0]?.toUpperCase() || '?'}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-white font-black text-sm">{partnerName}</h4>
                                  <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono mt-0.5">
                                    <span className="text-[#00ff62] font-semibold">{sess.skill}</span>
                                  </div>
                                </div>
                              </div>

                              <span
                                className={`text-[10px] font-mono font-extrabold border px-3 py-1 rounded-full uppercase tracking-wider ${statusStyle}`}
                              >
                                {sess.status}
                              </span>
                            </div>

                            <div className="bg-black/50 p-3 rounded-2xl border border-white/[0.06] flex items-center justify-between text-xs font-mono">
                              <div className="flex items-center gap-2 text-white/80">
                                <FaClock className="text-[#00ff62]" />
                                <span>
                                  {sess.scheduledAt
                                    ? new Date(sess.scheduledAt).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                      })
                                    : 'Schedule TBD'}
                                </span>
                              </div>

                              {isAgreed ? (
                                <span className="text-[10px] text-[#00ff62] font-extrabold flex items-center gap-1">
                                  <FaCheckCircle /> Scheduled
                                </span>
                              ) : (
                                <span className="text-[10px] text-amber-400 font-extrabold flex items-center gap-1">
                                  <FaExclamationCircle /> Schedule Needed
                                </span>
                              )}
                            </div>

                            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2 flex-wrap">
                              {partner && (
                                <button
                                  onClick={() => onOpenChat && onOpenChat(partner)}
                                  className="px-3.5 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition cursor-pointer flex items-center gap-1.5"
                                >
                                  <FaComments /> Message
                                </button>
                              )}

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setScheduleModalSession(sess)}
                                  className="px-3 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-[#00ff62] hover:text-black transition cursor-pointer flex items-center gap-1.5"
                                >
                                  <FaCalendarAlt /> Schedule
                                </button>

                                <button
                                  onClick={() => onLaunchMeet && onLaunchMeet(sess)}
                                  className="px-4 py-2 rounded-xl bg-[#00ff62] text-black font-black text-xs hover:bg-emerald-400 transition cursor-pointer shadow-[0_0_15px_rgba(0,255,98,0.3)] flex items-center gap-1.5"
                                >
                                  <FaVideo /> Join Call
                                </button>

                                <button
                                  onClick={() => handleCompleteSession(sess._id)}
                                  className="px-3 py-2 rounded-xl bg-violet-500/20 text-violet-300 font-bold text-xs hover:bg-violet-500 hover:text-white transition cursor-pointer flex items-center gap-1"
                                  title="Mark Completed"
                                >
                                  <FaCheck />
                                </button>
                              </div>
                            </div>
                          </div>
                        </BorderGlow>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-white font-black text-xs uppercase tracking-wider flex items-center gap-2">
                  <FaHistory className="text-[#00ff62]" /> Previous Swaps History ({historySessions.length})
                </h3>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-[#12121c] border border-white/[0.06] rounded-3xl h-32 animate-pulse" />
                  ))}
                </div>
              ) : historySessions.length === 0 ? (
                <div className="text-center py-16 bg-[#12121c]/80 border border-white/[0.06] rounded-3xl p-8 space-y-2 shadow-xl">
                  <FaStar className="text-4xl text-white/20 mx-auto mb-2" />
                  <p className="text-white/60 text-sm font-bold">No previous completed swaps yet</p>
                  <p className="text-white/30 text-xs max-w-xs mx-auto">
                    Completed or archived sessions will appear here in your swap history.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {historySessions.map((sess) => {
                    const isHelper = sess.helper?._id === user?._id || sess.helper === user?._id;
                    const partner = isHelper ? sess.requester : sess.helper;
                    const partnerName = partner?.name
                      ? partner.name.includes('@')
                        ? partner.name.split('@')[0]
                        : partner.name
                      : 'Swap Partner';

                    const statusStyle = STATUS_COLORS[sess.status] || STATUS_COLORS.completed;

                    return (
                      <BorderGlow
                        key={sess._id}
                        backgroundColor="#12121c"
                        borderRadius={24}
                        glowColor="250 80 50"
                        glowIntensity={1.0}
                        colors={['#8b5cf6', '#00ff62', '#3b82f6']}
                        className="p-5 shadow-lg opacity-90 hover:opacity-100"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white font-black text-xs">
                                {partnerName[0]?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <h4 className="text-white font-black text-sm">{partnerName}</h4>
                                <p className="text-white/40 text-xs font-mono">{sess.skill}</p>
                              </div>
                            </div>

                            <span
                              className={`text-[10px] font-mono font-extrabold border px-3 py-1 rounded-full uppercase tracking-wider ${statusStyle}`}
                            >
                              {sess.status}
                            </span>
                          </div>

                          {partner && (
                            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-end">
                              <button
                                onClick={() => onOpenChat && onOpenChat(partner)}
                                className="px-3.5 py-1.5 rounded-xl bg-white/10 text-white/70 hover:text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                              >
                                <FaComments /> Message Partner
                              </button>
                            </div>
                          )}
                        </div>
                      </BorderGlow>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 sticky top-6">
          <SessionCalendar
            sessions={sessions}
            user={user}
            onLaunchMeet={onLaunchMeet}
            onOpenChat={onOpenChat}
          />
        </div>

      </div>

      {scheduleModalSession && (
        <ScheduleMeetModal
          session={scheduleModalSession}
          onClose={() => setScheduleModalSession(null)}
          onSuccess={fetchAllData}
        />
      )}

      {ratingModalSession && (
        <RatingModal
          session={ratingModalSession}
          user={user}
          onClose={() => setRatingModalSession(null)}
          onSubmitRating={async (sessionId, ratingData) => {
            await sessionsAPI.rate(sessionId, ratingData);
            fetchAllData();
          }}
        />
      )}

    </div>
  );
}
