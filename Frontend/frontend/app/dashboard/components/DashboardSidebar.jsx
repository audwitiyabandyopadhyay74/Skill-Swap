'use client';
import React from 'react';
import {
  RiHome5Line,
  RiSearchLine,
  RiChat3Line,
  RiHandHeartLine,
  RiUser3Line,
  RiLogoutBoxRLine,
  RiAddLine,
} from 'react-icons/ri';

import BorderGlow from '../../components/BorderGlow';

const navItems = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'browse', label: 'Exchange Feed', icon: RiSearchLine },
  { id: 'messages', label: 'Direct Messages', icon: RiChat3Line },
  { id: 'sessions', label: 'Sessions & Calendar', icon: RiHandHeartLine },
  { id: 'profile', label: 'My Profile', icon: RiUser3Line },
];

export default function DashboardSidebar({ activeTab, onNavigate, user, onLogout, onCreatePost }) {
  const cleanName = user?.name ? (user.name.includes('@') ? user.name.split('@')[0] : user.name) : 'User';
  const initials = cleanName.slice(0, 2).toUpperCase();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full max-h-[100vh] w-64 bg-[#0c0c12]/95 backdrop-blur-2xl border-r border-white/[0.08] flex-col z-50 font-sans shadow-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00ff62] flex items-center justify-center shadow-[0_0_25px_rgba(0,255,98,0.5)]">
            <span className="rotate-90 text-black text-xl font-black">S</span>
          </div>
          <div>
            <p className="text-white font-black text-lg tracking-tight">SkillSwap</p>
            <p className="text-[#00ff62] text-[10px] font-mono font-bold tracking-widest uppercase">Pro Direct Network</p>
          </div>
        </div>
      </div>

      <div className="p-3.5">
        <div className="p-3.5 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center gap-3 shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00ff62]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 via-indigo-500 to-purple-600 p-[2px] shadow-[0_0_15px_rgba(0,255,98,0.3)] flex-shrink-0">
            <div className="w-full h-full rounded-full bg-[#121216] flex items-center justify-center text-white font-extrabold text-xs">
              {initials}
            </div>
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-white text-xs font-bold truncate">{cleanName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[#00ff62] text-[10px] font-mono font-extrabold">⚡ {user?.points || 100} pts</span>
              <span className="text-white/40 text-[9px] font-mono truncate">{user?.badge || '🥉 Bronze'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3.5 pt-1 overflow-visible">
        <button
          onClick={onCreatePost}
          className="w-full py-3 px-4 rounded-2xl bg-[#00ff62] text-black font-black text-xs transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(0,255,98,0.4)] hover:shadow-[0_0_30px_rgba(0,255,98,0.6)] hover:bg-emerald-400 flex items-center justify-center gap-2 active:scale-98 border border-[#00ff62]"
        >
          <RiAddLine className="text-lg font-extrabold text-black" />
          <span>Post Skill Exchange</span>
        </button>
      </div>

      <nav className="flex-1 px-3.5 py-4 space-y-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${isActive
                  ? 'bg-[#00ff62]/15 text-[#00ff62] border border-[#00ff62]/40 shadow-[0_0_18px_rgba(0,255,98,0.2)] font-extrabold'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                }`}
            >
              <IconComponent className={`text-xl flex-shrink-0 transition-transform ${isActive ? 'text-[#00ff62] scale-110' : 'text-white/60'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3.5 pb-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-white/30 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 cursor-pointer"
        >
          <RiLogoutBoxRLine className="text-lg text-center flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
