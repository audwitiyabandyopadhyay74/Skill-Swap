'use client';
import React from 'react';
import { RiHome5Line, RiSearchLine, RiAddLine, RiHandHeartLine, RiUser3Line, RiChat3Line } from 'react-icons/ri';
import Dock from '../../components/Dock';

export default function MobileBottomNav({ activeTab, onNavigate, onCreatePost }) {
  const dockItems = [
    {
      icon: <RiHome5Line size={22} className={activeTab === 'home' ? 'text-[#00ff62]' : 'text-white/70'} />,
      label: 'Home',
      onClick: () => onNavigate('home'),
    },
    {
      icon: <RiSearchLine size={22} className={activeTab === 'browse' ? 'text-[#00ff62]' : 'text-white/70'} />,
      label: 'Browse',
      onClick: () => onNavigate('browse'),
    },
    {
      icon: <RiChat3Line size={22} className={activeTab === 'messages' ? 'text-[#00ff62]' : 'text-white/70'} />,
      label: 'Messages',
      onClick: () => onNavigate('messages'),
    },
    {
      icon: <RiAddLine size={24} className="text-black font-bold" />,
      label: 'Post Skill',
      onClick: onCreatePost,
      className: 'bg-[#00ff62] text-black border-[#00ff62] shadow-[0_0_15px_rgba(0,255,98,0.5)]',
    },
    {
      icon: <RiHandHeartLine size={22} className={activeTab === 'sessions' ? 'text-[#00ff62]' : 'text-white/70'} />,
      label: 'Sessions',
      onClick: () => onNavigate('sessions'),
    },
    {
      icon: <RiUser3Line size={22} className={activeTab === 'profile' ? 'text-[#00ff62]' : 'text-white/70'} />,
      label: 'Profile',
      onClick: () => onNavigate('profile'),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-1 left-0 right-0 z-50 flex justify-center pb-1 pointer-events-auto font-sans">
      <Dock
        items={dockItems}
        panelHeight={64}
        baseItemSize={46}
        magnification={64}
        distance={120}
      />
    </div>
  );
}
