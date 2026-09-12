'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BorderGlow from '../components/BorderGlow';
import WebThreads from '../components/WebThreads';
import { RiCpuLine, RiAwardLine, RiBrainLine, RiGroupLine, RiFlashlightLine, RiMagicLine } from 'react-icons/ri';
import Link from 'next/link';

export default function VisionPage() {
  const containerRef = useRef(null);

  const roadmapItems = [
    {
      quarter: 'Q3 2026',
      status: 'Live Now',
      icon: <RiFlashlightLine className="text-[#00ff62] text-2xl" />,
      title: 'Glassmorphic WebRTC Core',
      desc: 'High-definition 1-on-1 video rooms, direct messaging with Cloudinary media storage, and instant scheduling.'
    },
    {
      quarter: 'Q4 2026',
      status: 'In Development',
      icon: <RiCpuLine className="text-[#A78BFA] text-2xl" />,
      title: 'AI Smart Skill Matcher',
      desc: 'Machine learning algorithms that analyze user goals, time availability, and complementary skill vectors.'
    },
    {
      quarter: 'Q1 2027',
      status: 'Upcoming',
      icon: <RiAwardLine className="text-[#FF79C6] text-2xl" />,
      title: 'Verifiable Skill Credentials',
      desc: 'Earn cryptographic certificates and verified endorsement badges for completed skill exchanges.'
    },
    {
      quarter: 'Q2 2027',
      status: 'Planned',
      icon: <RiGroupLine className="text-[#38BDF8] text-2xl" />,
      title: 'Group Workshops & Masterclasses',
      desc: 'Host interactive multi-peer video workshops, live Q&As, and collaborative breakout rooms.'
    }
  ];

  useGSAP(() => {
    gsap.fromTo(
      '.gsap-hero',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.2 }
    );
    gsap.fromTo(
      '.gsap-roadmap',
      { scale: 0.9, y: 30, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.15, delay: 0.4 }
    );
    gsap.fromTo(
      '.gsap-quote',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.7 }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#07070b] text-white flex flex-col relative overflow-hidden font-sans">
      <Navbar />

      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 overflow-hidden">
        <WebThreads
          color1="#A78BFA"
          color2="#FF79C6"
          color3="#00ff62"
          speed={0.25}
          threadCount={7}
          frequency={4.5}
          spread={0.22}
          taper={1.0}
          position={0.5}
          fanMode="center"
          glow={0.03}
          falloff={0.55}
          thickness={1.2}
          brightness={0.7}
          opacity={0.8}
          mirror={true}
          shimmer={true}
          grain={true}
          grainIntensity={0.03}
          mouseInteraction={true}
          mouseStrength={0.25}
        />
      </div>

      <section className="relative pt-36 pb-20 px-6 max-w-6xl mx-auto w-full text-center z-10">
        <span className="gsap-hero text-xs font-mono font-bold uppercase tracking-widest text-[#A78BFA] bg-[#A78BFA]/10 px-4 py-1.5 rounded-full border border-[#A78BFA]/30 mb-6 inline-block">
          Platform Vision & Roadmap
        </span>
        <h1 className="gsap-hero text-4xl md:text-6xl font-black tracking-tight leading-tight text-white mb-6">
          Shaping the Future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#FF79C6] to-[#00ff62]">
            Decentralized Education
          </span>
        </h1>
        <p className="gsap-hero text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          We envision a world where knowledge is freely exchanged without financial friction. Discover how we are building an intelligent, AI-powered peer-to-peer ecosystem.
        </p>
      </section>

      <section className="px-6 max-w-5xl mx-auto w-full mb-24 z-10 space-y-8">
        <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-12 text-white">
          Our Strategic <span className="text-[#FF79C6]">Roadmap</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roadmapItems.map((item, idx) => (
            <BorderGlow key={`roadmap-${idx}`} color="#A78BFA" glowIntensity={0.3} className="gsap-roadmap rounded-3xl">
              <div className="p-8 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/10 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#A78BFA] uppercase tracking-wider">
                    {item.quarter}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                      item.status === 'Live Now'
                        ? 'bg-[#00ff62]/10 text-[#00ff62] border-[#00ff62]/30'
                        : item.status === 'In Development'
                        ? 'bg-[#A78BFA]/10 text-[#A78BFA] border-[#A78BFA]/30'
                        : 'bg-white/10 text-white/70 border-white/15'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-extrabold text-white">{item.title}</h3>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
              </div>
            </BorderGlow>
          ))}
        </div>
      </section>

      <section className="gsap-quote px-6 max-w-4xl mx-auto w-full mb-24 z-10">
        <div className="p-10 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 space-y-6 text-center">
          <RiMagicLine className="text-4xl text-[#00ff62] mx-auto" />
          <h2 className="text-3xl font-extrabold text-white">Guiding Core Belief</h2>
          <p className="text-base text-white/80 leading-relaxed max-w-2xl mx-auto font-sans">
            "Everyone is a master at something, and everyone is a novice at something else. When we connect reciprocal curiosities, learning becomes limitless."
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
