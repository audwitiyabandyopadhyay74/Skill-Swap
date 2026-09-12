'use client';
import React from 'react';
import {
  FaCheck,
  FaLink,
  FaPlusCircle,
  FaStar,
  FaRegSmile,
  FaCalendarAlt,
  FaVideo,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaComments,
} from 'react-icons/fa';

const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-[#121217]/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-5 md:p-6 flex flex-col justify-between gap-4 hover:border-[#00ff62]/50 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_35px_rgba(0,255,98,0.15)] group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#00ff62]/5 to-transparent rounded-full blur-xl pointer-events-none group-hover:bg-[#00ff62]/15 transition" />

    <div className="flex items-center justify-between relative z-10">
      <span className="text-white/40 text-[11px] font-mono font-extrabold uppercase tracking-wider">{label}</span>
      <div className="w-9 h-9 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#00ff62] group-hover:scale-110 group-hover:border-[#00ff62]/40 transition shadow-inner">
        {icon}
      </div>
    </div>
    <p className={`text-3xl md:text-4xl font-black tracking-tight ${color} relative z-10`}>{value ?? '—'}</p>
  </div>
);

const SkillTag = ({ skill, color }) => (
  <span className={`px-3 py-1 rounded-xl text-xs font-mono font-extrabold shadow-sm ${color}`}>{skill}</span>
);

export default function DashboardHome({ user, dashData, sessions = [], onNavigate, onLaunchMeet }) {
  const stats = dashData?.stats || {
    sessionsCompleted: user?.sessionsCompleted || 0,
    connections: user?.connections?.length || 0,
    skillsOffered: user?.skillsOffered?.length || 0,
    rating: user?.rating || 0,
  };

  const scheduledMeetings = sessions.filter(
    (s) => s.meetingStatus === 'scheduled' || s.meetingStatus === 'requested'
  );

  const formatScheduledDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const cleanDisplayName = user?.name
    ? user.name.includes('@')
      ? user.name.split('@')[0]
      : user.name
    : 'there';

  return (
    <div className="p-4 md:p-8 space-y-8 font-sans pb-36 md:pb-8">
      <div className="bg-gradient-to-r from-[#121217]/90 via-[#181826]/90 to-[#121217]/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#00ff62]/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#00ff62]/15 text-[#00ff62] border border-[#00ff62]/30 text-[10px] font-mono font-extrabold uppercase tracking-widest flex items-center gap-1.5 inline-flex shadow-[0_0_10px_rgba(0,255,98,0.2)]">
            <FaStar className="text-amber-400" /> SkillSwap Command Center
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Welcome back, <span className="text-[#00ff62]">{cleanDisplayName}</span>{' '}
            <FaRegSmile className="inline-block text-yellow-400" />
          </h1>
          <p className="text-white/50 text-xs md:text-sm max-w-xl leading-relaxed">
            Here is your live overview of active skill swaps, scheduled video meetings, and direct connection requests.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Skill Points" value={`⚡ ${user?.points || 0}`} color="text-[#00ff62]" icon={<FaStar />} />
        <StatCard label="My Friends" value={user?.connections?.length || 0} color="text-violet-400" icon={<FaLink />} />
        <StatCard label="Sessions Done" value={stats?.sessionsCompleted || user?.sessionsCompleted || 0} color="text-blue-400" icon={<FaCheck />} />
        <StatCard label="Rating" value={stats?.rating !== undefined ? `${stats.rating}` : '0'} color="text-amber-400" icon={<FaStar />} />
      </div>

      <div className="bg-[#121217]/90 backdrop-blur-2xl border border-[#00ff62]/30 rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00ff62]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#00ff62]/10 border border-[#00ff62]/30 flex items-center justify-center text-[#00ff62] flex-shrink-0 shadow-[0_0_15px_rgba(0,255,98,0.2)]">
              <FaCalendarAlt className="text-lg" />
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-black text-base md:text-lg leading-tight truncate">Scheduled Meetings</h2>
              <p className="text-white/40 text-xs truncate">Agreed video call schedules & timetables</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('sessions')}
            className="text-xs text-[#00ff62] hover:underline font-mono font-bold cursor-pointer flex-shrink-0"
          >
            View All →
          </button>
        </div>

        {scheduledMeetings.length === 0 ? (
          <div className="text-center py-10 bg-black/40 border border-white/5 rounded-2xl p-4">
            <p className="text-white/40 text-xs font-semibold">No meetings scheduled yet</p>
            <p className="text-white/20 text-[11px] mt-1">
              Go to Sessions tab or Calendar to request a date/time with your swap partner!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scheduledMeetings.map((s) => {
              const isHelper = s.helper?._id === user?._id;
              const partner = isHelper ? s.requester : s.helper;
              const isAgreed = s.meetingStatus === 'scheduled';
              const partnerName = partner?.name
                ? partner.name.includes('@')
                  ? partner.name.split('@')[0]
                  : partner.name
                : 'Partner';

              return (
                <div
                  key={s._id}
                  className="bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-[#00ff62]/50 transition shadow-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center font-black text-white text-xs flex-shrink-0 shadow-md">
                        {partnerName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <h4 className="text-white font-extrabold text-sm truncate">{partnerName}</h4>
                        <p className="text-white/40 text-xs font-mono truncate">{s.skill}</p>
                      </div>
                    </div>

                    {isAgreed ? (
                      <span className="text-[10px] text-[#00ff62] bg-[#00ff62]/10 border border-[#00ff62]/30 px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 flex-shrink-0 shadow-[0_0_8px_rgba(0,255,98,0.2)]">
                        <FaCheckCircle /> Agreed
                      </span>
                    ) : (
                      <span className="text-[10px] text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 flex-shrink-0">
                        <FaExclamationCircle /> Pending
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-white/5 gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-white/70 font-mono truncate">
                      <FaClock className="text-[#00ff62] flex-shrink-0" />
                      <span className="truncate">{formatScheduledDate(s.scheduledAt)}</span>
                    </div>

                    {isAgreed ? (
                      <button
                        onClick={() => onLaunchMeet && onLaunchMeet(s)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#00ff62] text-black text-xs font-black hover:bg-emerald-400 transition cursor-pointer shadow-[0_0_15px_rgba(0,255,98,0.3)] flex items-center gap-1.5 flex-shrink-0"
                      >
                        <FaVideo className="text-xs" /> Join Meet
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigate('sessions')}
                        className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition cursor-pointer flex-shrink-0"
                      >
                        Manage
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#121217]/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-extrabold text-base">Active Skill Swaps</h2>
            <span className="text-white/40 text-xs font-mono">{sessions.length} total</span>
          </div>
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-white/30 text-xs">
              <p className="font-semibold">No active sessions</p>
              <p className="text-[11px] text-white/20 mt-1">Browse exchange feed to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.slice(0, 4).map((s) => {
                const isHelper = s.helper?._id === user?._id;
                const partner = isHelper ? s.requester : s.helper;
                const partnerName = partner?.name
                  ? partner.name.includes('@')
                    ? partner.name.split('@')[0]
                    : partner.name
                  : 'Partner';
                return (
                  <div
                    key={s._id}
                    className="bg-black/40 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-black flex-shrink-0 text-white">
                        {partnerName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="text-white text-xs font-bold truncate">{partnerName}</p>
                        <p className="text-white/40 text-[11px] font-mono truncate">{s.skill}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#00ff62] bg-[#00ff62]/10 border border-[#00ff62]/20 px-2.5 py-0.5 rounded-full font-mono font-bold flex-shrink-0">
                      {s.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-[#121217]/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-white font-extrabold text-base">Your Skills Profile</h2>
          <div className="space-y-4">
            <div>
              <p className="text-white/30 text-xs font-mono uppercase font-bold tracking-wider mb-2">Offering</p>
              <div className="flex flex-wrap gap-2">
                {user?.skillsOffered?.length > 0 ? (
                  user.skillsOffered.map((s) => (
                    <SkillTag key={s} skill={s} color="bg-[#00ff62]/10 text-[#00ff62] border border-[#00ff62]/30" />
                  ))
                ) : (
                  <span className="text-white/20 text-xs">No skills added yet</span>
                )}
              </div>
            </div>
            <div className="h-px bg-white/[0.06]" />
            <div>
              <p className="text-white/30 text-xs font-mono uppercase font-bold tracking-wider mb-2">Wanting to Learn</p>
              <div className="flex flex-wrap gap-2">
                {user?.skillsWanted?.length > 0 ? (
                  user.skillsWanted.map((s) => (
                    <SkillTag key={s} skill={s} color="bg-indigo-500/10 text-indigo-300 border border-indigo-500/30" />
                  ))
                ) : (
                  <span className="text-white/20 text-xs">No skills added yet</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
