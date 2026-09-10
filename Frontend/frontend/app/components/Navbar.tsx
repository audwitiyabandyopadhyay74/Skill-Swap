"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { RiHome5Line, RiInformationLine, RiLightbulbLine, RiMailSendLine, RiLoginBoxLine, RiUserAddLine, RiDashboardLine } from 'react-icons/ri';
import Dock from './Dock';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('ss_token');
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleNav = (href: string, sectionId?: string) => {
    if (pathname === '/' && sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    router.push(href);
  };

  const mobileDockItems = [
    {
      icon: <RiHome5Line size={20} color="#00ff62" />,
      label: 'Home',
      onClick: () => router.push('/'),
    },
    {
      icon: <RiInformationLine size={20} color="#00ff62" />,
      label: 'About',
      onClick: () => handleNav('/about', 'about'),
    },
    {
      icon: <RiLightbulbLine size={20} color="#00ff62" />,
      label: 'Vision',
      onClick: () => handleNav('/vision', 'vision'),
    },
    {
      icon: <RiMailSendLine size={20} color="#00ff62" />,
      label: 'Contact',
      onClick: () => router.push('/contact-us'),
    },
    ...(isLoggedIn
      ? [
          {
            icon: <RiDashboardLine size={20} color="#00ff62" />,
            label: 'Dashboard',
            onClick: () => router.push('/dashboard'),
          },
        ]
      : [
          {
            icon: <RiLoginBoxLine size={20} color="#00ff62" />,
            label: 'Log In',
            onClick: () => router.push('/auth/login'),
          },
          {
            icon: <RiUserAddLine size={20} color="#00ff62" />,
            label: 'Sign Up',
            onClick: () => router.push('/auth/signup'),
          },
        ]),
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 h-24 px-12 items-center justify-between z-50 backdrop-blur-2xl bg-black/60 border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:via-transparent before:to-white/5 before:pointer-events-none">
        <div className="flex items-center gap-10 relative z-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="logo bg-[#00ff62] w-11 h-11 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(0,255,98,0.5)]">
              <span className="rotate-90 text-black text-2xl font-black">S</span>
            </div>
            <span className="text-white font-extrabold text-xl tracking-tight">SkillSwap</span>
          </div>

          <ul className="flex items-center gap-8 text-sm font-semibold text-white/70">
            <li
              className={`hover:text-[#00ff62] cursor-pointer transition ${pathname === '/' ? 'text-[#00ff62] font-bold' : ''}`}
              onClick={() => router.push('/')}
            >
              Home
            </li>
            <li
              className={`hover:text-[#00ff62] cursor-pointer transition ${pathname === '/about' ? 'text-[#00ff62] font-bold' : ''}`}
              onClick={() => handleNav('/about', 'about')}
            >
              About
            </li>
            <li
              className={`hover:text-[#00ff62] cursor-pointer transition ${pathname === '/vision' ? 'text-[#00ff62] font-bold' : ''}`}
              onClick={() => handleNav('/vision', 'vision')}
            >
              Vision
            </li>
            <li
              className={`hover:text-[#00ff62] cursor-pointer transition ${pathname === '/contact-us' ? 'text-[#00ff62] font-bold' : ''}`}
              onClick={() => router.push('/contact-us')}
            >
              Contact Us
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          {isLoggedIn ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="px-7 py-2.5 rounded-xl bg-[#00ff62] text-black font-extrabold text-xs hover:bg-emerald-400 transition cursor-pointer shadow-[0_0_25px_rgba(0,255,98,0.5)] hover:shadow-[0_0_35px_rgba(0,255,98,0.7)] flex items-center gap-2"
            >
              <RiDashboardLine size={16} />
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push('/auth/login')}
                className="px-6 py-2.5 rounded-xl border border-white/15 text-white font-bold text-xs hover:border-[#00ff62]/50 hover:text-[#00ff62] transition cursor-pointer"
              >
                Log in
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="px-6 py-2.5 rounded-xl bg-[#00ff62] text-black font-extrabold text-xs hover:bg-emerald-400 transition cursor-pointer shadow-[0_0_20px_rgba(0,255,98,0.4)] hover:shadow-[0_0_30px_rgba(0,255,98,0.6)]"
              >
                Sign Up Free
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Logo */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <div className="logo bg-[#00ff62] w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,98,0.5)] cursor-pointer" onClick={() => router.push('/')}>
          <span className="rotate-90 text-black text-2xl font-black">S</span>
        </div>
      </div>

      {/* Mobile Bottom Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-2">
        <Dock
          items={mobileDockItems}
          panelHeight={64}
          baseItemSize={46}
          magnification={62}
          distance={120}
        />
      </div>
    </>
  );
};

export default Navbar;

