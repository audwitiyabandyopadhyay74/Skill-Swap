'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BorderGlow from '../components/BorderGlow';
import MoltenMetal from '../components/MoltenMetal';
import { RiRocketLine, RiTeamLine, RiShieldCheckLine, RiExchangeLine, RiVideoChatLine, RiGlobalLine } from 'react-icons/ri';
import Link from 'next/link';

export default function AboutPage() {
  const containerRef = useRef(null);

  const stats = [
    { label: 'Active Skill Swappers', value: '10,000+' },
    { label: 'Skills Available to Learn', value: '500+' },
    { label: 'Successful Video Sessions', value: '25,000+' },
    { label: 'Community Satisfaction', value: '99.4%' }
  ];

  const pillars = [
    {
      icon: <RiExchangeLine className="text-[#00ff62] text-3xl" />,
      title: 'Peer-to-Peer Learning',
      desc: 'No currency needed. Teach your specialty—whether coding, design, languages, or music—and learn anything in return.'
    },
    {
      icon: <RiVideoChatLine className="text-[#A78BFA] text-3xl" />,
      title: 'Real-Time HD Video Calls',
      desc: 'Built-in WebRTC video rooms equipped with screen sharing, interactive code snippets, and direct messaging.'
    },
    {
      icon: <RiShieldCheckLine className="text-[#FF79C6] text-3xl" />,
      title: 'Verified Skill Ratings',
      desc: 'Transparent reviews and trust metrics ensure high-quality learning experiences with every skill partner.'
    },
    {
      icon: <RiGlobalLine className="text-[#38BDF8] text-3xl" />,
      title: 'Global Community',
      desc: 'Connect with passionate mentors, enthusiasts, and professionals across 80+ countries 24/7.'
    }
  ];

  useGSAP(() => {
    gsap.fromTo(
      '.gsap-hero',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.2 }
    );
    gsap.fromTo(
      '.gsap-stat',
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', stagger: 0.12, delay: 0.3 }
    );
    gsap.fromTo(
      '.gsap-pillar',
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.15, delay: 0.5 }
    );
    gsap.fromTo(
      '.gsap-cta',
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.7 }
    );
  }, { scope: containerRef });


  return (
    <div ref={containerRef} className="min-h-screen bg-[#07070b] text-white flex flex-col relative overflow-hidden font-sans">
      <Navbar />

      {/* 3D MoltenMetal Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 overflow-hidden">
        <MoltenMetal
          color1="#00ff62"
          color2="#A78BFA"
          color3="#FFFFFF"
          speed={0.25}
          scale={3.5}
          detail={3}
          glow={1.4}
          coreSize={0.1}
          swirl={0.8}
          fold={-0.2}
          blackPoint={0.08}
          brightness={1.2}
          colorMode="molten"
          grain={true}
          grainIntensity={0.03}
          mouseInteraction={true}
          mouseStrength={0.2}
          opacity={0.8}
        />
      </div>

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 px-6 max-w-6xl mx-auto w-full text-center z-10">
        <span className="gsap-hero text-xs font-mono font-bold uppercase tracking-widest text-[#00ff62] bg-[#00ff62]/10 px-4 py-1.5 rounded-full border border-[#00ff62]/30 mb-6 inline-block">
          About SkillSwap
        </span>
        <h1 className="gsap-hero text-4xl md:text-6xl font-black tracking-tight leading-tight text-white mb-6">
          Democratizing Knowledge Through <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff62] via-[#A78BFA] to-[#FF79C6]">
            Direct Skill Exchange
          </span>
        </h1>
        <p className="gsap-hero text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          SkillSwap is a futuristic peer-to-peer knowledge sharing network designed to break traditional education barriers. We empower everyone to teach what they master and learn what they love.
        </p>
      </section>

      {/* Stats Grid */}
      <section className="px-6 max-w-6xl mx-auto w-full mb-20 z-10">
        <BorderGlow color="#00ff62" glowIntensity={0.4} className="rounded-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 text-center">
            {stats.map((s, idx) => (
              <div key={`stat-${idx}`} className="gsap-stat space-y-1">
                <p className="text-3xl md:text-4xl font-extrabold text-[#00ff62]">{s.value}</p>
                <p className="text-xs md:text-sm text-white/60 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </BorderGlow>
      </section>

      {/* Platform Pillars */}
      <section className="px-6 max-w-6xl mx-auto w-full mb-24 z-10">
        <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-12 text-white">
          Built for <span className="text-[#A78BFA]">Collaborative Growth</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((p, idx) => (
            <div
              key={`pillar-${idx}`}
              className="gsap-pillar p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#00ff62]/40 transition duration-300 space-y-4 hover:shadow-[0_0_30px_rgba(0,255,98,0.15)]"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                {p.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{p.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="gsap-cta px-6 max-w-4xl mx-auto w-full mb-24 z-10 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-[#00ff62]/10 via-[#A78BFA]/10 to-[#FF79C6]/10 border border-white/15 backdrop-blur-2xl space-y-6">
          <h2 className="text-3xl font-extrabold text-white">Ready to Swap Skills Today?</h2>
          <p className="text-sm text-white/70 max-w-lg mx-auto">
            Join thousands of active learners and experts. Create your profile, list your skills, and schedule your first video session.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/auth/signup"
              className="px-8 py-3.5 rounded-2xl bg-[#00ff62] text-black font-extrabold text-sm hover:bg-emerald-400 transition shadow-[0_0_25px_rgba(0,255,98,0.4)]"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact-us"
              className="px-8 py-3.5 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition border border-white/15"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

