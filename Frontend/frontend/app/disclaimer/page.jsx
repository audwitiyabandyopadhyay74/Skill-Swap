'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DisclaimerPage() {
  const containerRef = useRef(null);

  const sections = [
    {
      id: 'educational-nature',
      title: '1. Peer-to-Peer Educational Nature',
      content:
        'SkillSwap is an open platform facilitating peer-to-peer knowledge exchange. The instruction, tutorials, and advice offered by community members are based on personal experience and should not replace formal accredited education or licensed advice.'
    },
    {
      id: 'no-guarantee',
      title: '2. No Professional Advice Guarantee',
      content:
        'Content discussed in skill sessions (including medical, legal, financial, or engineering advice) is for informational purposes only. SkillSwap explicitly disclaims liability for any actions taken based on peer-to-peer exchanges.'
    },
    {
      id: 'user-content',
      title: '3. User-Generated Content',
      content:
        'SkillSwap does not pre-screen or endorse user-generated posts, proposals, or video call contents. Opinions expressed by users belong solely to the individual creator and do not reflect the official position of SkillSwap.'
    },
    {
      id: 'external-links',
      title: '4. External Links & Resources',
      content:
        'Messages or user profiles may contain links to external third-party websites. SkillSwap is not responsible for the content, privacy policies, or practices of third-party platforms.'
    }
  ];

  useGSAP(() => {
    gsap.fromTo(
      '.gsap-hero',
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.15 }
    );
    gsap.fromTo(
      '.gsap-section',
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.1, delay: 0.3 }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#07070b] text-white flex flex-col relative overflow-hidden font-sans">
      <Navbar />

      <section className="relative pt-36 pb-16 px-6 max-w-4xl mx-auto w-full text-center z-10">
        <span className="gsap-hero text-xs font-mono font-bold uppercase tracking-widest text-[#FF79C6] bg-[#FF79C6]/10 px-4 py-1.5 rounded-full border border-[#FF79C6]/30 mb-6 inline-block">
          Platform Notice
        </span>
        <h1 className="gsap-hero text-4xl md:text-5xl font-black tracking-tight leading-tight text-white mb-4">
          Disclaimer
        </h1>
        <p className="gsap-hero text-white/60 text-sm font-mono">Last Updated: September 10, 2026</p>
      </section>

      <section className="px-6 max-w-4xl mx-auto w-full mb-24 z-10">
        <div className="p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 space-y-8">
          {sections.map((sec) => (
            <div key={sec.id} className="gsap-section space-y-3 pb-6 border-b border-white/10 last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-[#FF79C6]">{sec.title}</h2>
              <p className="text-sm text-white/80 leading-relaxed font-sans">{sec.content}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
