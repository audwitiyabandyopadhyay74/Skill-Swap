'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usersAPI } from '../app/lib/api';
import {
  RiUser3Line,
  RiStarLine,
  RiHandHeartLine,
  RiLightbulbLine,
  RiArrowLeftLine,
  RiChat3Line,
} from 'react-icons/ri';

export default function PublicProfilePage() {
  const { username } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;
    const token = localStorage.getItem('ss_token');
    if (!token) {
      router.replace('/auth/login');
      return;
    }
    usersAPI.getByName(username)
      .then((data) => setProfile(data.user))
      .catch(() => setError('User not found'))
      .finally(() => setLoading(false));
  }, [username, router]);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#0a0a0a] flex items-center justify-center font-mono text-[#00ff62]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#00ff62]/20 border-t-[#00ff62] rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-screen h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-mono text-white/60 gap-4">
        <RiUser3Line size={48} className="text-white/20" />
        <p className="text-lg font-bold">User not found</p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#00ff62] text-sm hover:underline"
        >
          <RiArrowLeftLine /> Go back
        </button>
      </div>
    );
  }

  const cleanName = profile.name?.includes('@') ? profile.name.split('@')[0] : profile.name;
  const initials = cleanName?.slice(0, 2).toUpperCase() || '??';
  const pts = profile.points || 100;
  let badge = '🥉 Bronze Swapper';
  if (pts >= 1000) badge = '💎 Diamond Master';
  else if (pts >= 500) badge = '🥇 Gold Swapper';
  else if (pts >= 250) badge = '🥈 Silver Swapper';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition"
        >
          <RiArrowLeftLine /> Back
        </button>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 flex flex-col items-center gap-5 shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 via-indigo-500 to-purple-600 p-[3px] shadow-[0_0_30px_rgba(0,255,98,0.3)]">
            {profile.avatar ? (
              <img src={profile.avatar} alt={cleanName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-[#121216] flex items-center justify-center text-white font-black text-2xl">
                {initials}
              </div>
            )}
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-black text-white">{cleanName}</h1>
            <p className="text-[#00ff62] text-xs font-mono font-bold mt-1">/{username}</p>
            <span className="mt-2 inline-block text-[11px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/60 font-mono">
              {badge}
            </span>
          </div>

          <div className="flex items-center gap-6 text-center">
            <div>
              <p className="text-[#00ff62] text-xl font-black">⚡ {pts}</p>
              <p className="text-white/40 text-[11px] font-mono uppercase tracking-wider">Points</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className="text-white text-xl font-black">{profile.sessionsCompleted || 0}</p>
              <p className="text-white/40 text-[11px] font-mono uppercase tracking-wider">Sessions</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className="text-white text-xl font-black">{profile.rating ? profile.rating.toFixed(1) : '—'}</p>
              <p className="text-white/40 text-[11px] font-mono uppercase tracking-wider">Rating</p>
            </div>
          </div>

          {profile.bio && (
            <p className="text-white/60 text-sm text-center leading-relaxed max-w-md">{profile.bio}</p>
          )}

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {profile.skillsOffered?.length > 0 && (
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-[#00ff62] text-xs font-bold uppercase tracking-wider mb-3">
                  <RiLightbulbLine /> Skills Offered
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsOffered.map((s) => (
                    <span key={s} className="text-[11px] bg-[#00ff62]/10 text-[#00ff62] border border-[#00ff62]/20 px-2.5 py-1 rounded-full font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {profile.skillsWanted?.length > 0 && (
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <RiHandHeartLine /> Wants to Learn
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsWanted.map((s) => (
                    <span key={s} className="text-[11px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => router.push('/dashboard/messages')}
            className="mt-2 flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#00ff62] text-black font-black text-sm shadow-[0_0_20px_rgba(0,255,98,0.4)] hover:shadow-[0_0_30px_rgba(0,255,98,0.6)] hover:bg-emerald-400 transition-all"
          >
            <RiChat3Line /> Message {cleanName}
          </button>
        </div>
      </div>
    </div>
  );
}
