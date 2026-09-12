'use client';

import React from 'react';
import Link from 'next/link';
import { RiRocketLine, RiShieldLine, RiTeamLine, RiMailLine } from 'react-icons/ri';

const Footer = () => {
  return (
    <footer className="w-full bg-[#050508]/90 backdrop-blur-2xl border-t border-white/10 text-white/70 pt-12 pb-28 md:pb-16 px-6 md:px-16 z-40 relative overflow-hidden">
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00ff62]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        <div className="flex md:hidden items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00ff62]/10 border border-[#00ff62]/30 flex items-center justify-center text-[#00ff62]">
              <RiRocketLine size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">SkillSwap Network</p>
              <p className="text-[10px] text-white/50">Reciprocal Knowledge Exchange</p>
            </div>
          </div>
          <Link
            href="/auth/signup"
            className="px-4 py-2 rounded-xl bg-[#00ff62] text-black font-extrabold text-xs shadow-[0_0_15px_rgba(0,255,98,0.3)]"
          >
            Join Free
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="logo bg-[#00ff62] w-9 h-9 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,98,0.4)]">
                <span className="rotate-90 text-black text-xl font-black">S</span>
              </div>
              <span className="text-white font-extrabold text-lg tracking-tight">SkillSwap</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed max-w-sm">
              The futuristic peer-to-peer knowledge network. Learn what you love, teach what you master.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-[#00ff62] tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">About Us</Link>
              </li>
              <li>
                <Link href="/vision" className="hover:text-white transition">Vision & Roadmap</Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white transition">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-[#A78BFA] tracking-wider">Legal</h4>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition">Disclaimer</Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-[#FF79C6] tracking-wider">Community</h4>
            <div className="flex flex-wrap md:flex-col gap-2 md:gap-2 text-xs md:text-sm">
              <Link href="/auth/login" className="px-3 py-1.5 md:p-0 rounded-lg bg-white/5 md:bg-transparent border border-white/10 md:border-0 hover:text-white transition">
                Log In
              </Link>
              <Link href="/auth/signup" className="px-3 py-1.5 md:p-0 rounded-lg bg-white/5 md:bg-transparent border border-white/10 md:border-0 hover:text-white transition">
                Sign Up Free
              </Link>
              <Link href="/dashboard" className="px-3 py-1.5 md:p-0 rounded-lg bg-white/5 md:bg-transparent border border-white/10 md:border-0 hover:text-white transition">
                Dashboard Portal
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[11px] md:text-xs text-white/40 gap-3 text-center md:text-left">
          <p>© {new Date().getFullYear()} SkillSwap Network Inc. All rights reserved.</p>
          <p className="font-mono text-[#00ff62]/60">Built with WebRTC & Modern WebGL</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
