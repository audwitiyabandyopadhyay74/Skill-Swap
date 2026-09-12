'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsPage() {
  const containerRef = useRef(null);

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content:
        'By creating an account or accessing the SkillSwap platform, you agree to comply with and be legally bound by these Terms and Conditions. If you do not agree to these terms, you may not access or use SkillSwap.'
    },
    {
      id: 'exchange-code',
      title: '2. Peer-to-Peer Exchange Honor Code',
      content:
        'SkillSwap operates on a mutual skill-for-skill exchange model. Users agree to provide authentic, respectful, and high-quality instruction during scheduled video meet sessions. Monies or outside monetary demands for basic skill swaps are strictly prohibited.'
    },
    {
      id: 'conduct',
      title: '3. Community Guidelines & Conduct',
      content:
        'Harassment, hate speech, explicit content, spamming, and fraudulent representation of credentials will result in immediate and permanent account suspension. All interactions on our WebRTC channels and direct messaging must remain professional and safe.'
    },
    {
      id: 'privacy-webrtc',
      title: '4. WebRTC Video & Audio Session Policy',
      content:
        'Peer-to-peer video sessions are encrypted end-to-end between participants. Unconsented recording or broadcasting of another user’s session is illegal and ground for instant account termination.'
    },
    {
      id: 'account-security',
      title: '5. Account Security & Credentials',
      content:
        'You are responsible for maintaining the confidentiality of your account login credentials. SkillSwap is not liable for unauthorized access caused by failure to protect your authentication tokens.'
    },
    {
      id: 'modifications',
      title: '6. Modifications to Terms',
      content:
        'SkillSwap reserves the right to update these terms at any time. Continued use of the platform following published changes constitutes full acceptance of the updated terms.'
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
        <span className="gsap-hero text-xs font-mono font-bold uppercase tracking-widest text-[#00ff62] bg-[#00ff62]/10 px-4 py-1.5 rounded-full border border-[#00ff62]/30 mb-6 inline-block">
          Legal Agreement
        </span>
        <h1 className="gsap-hero text-4xl md:text-5xl font-black tracking-tight leading-tight text-white mb-4">
          Terms & Conditions
        </h1>
        <p className="gsap-hero text-white/60 text-sm font-mono">Last Updated: September 10, 2026</p>
      </section>

      <section className="px-6 max-w-4xl mx-auto w-full mb-24 z-10">
        <div className="p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 space-y-8">
          {sections.map((sec) => (
            <div key={sec.id} className="gsap-section space-y-3 pb-6 border-b border-white/10 last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-[#00ff62]">{sec.title}</h2>
              <p className="text-sm text-white/80 leading-relaxed font-sans">{sec.content}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
