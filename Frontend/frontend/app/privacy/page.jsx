'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPage() {
  const containerRef = useRef(null);

  const sections = [
    {
      id: 'collection',
      title: '1. Information We Collect',
      content:
        'We collect essential user information to deliver our peer-to-peer skill swap services, including profile metadata (name, email, skills offered, skills desired), public avatar images, and direct message communications.'
    },
    {
      id: 'media-storage',
      title: '2. Media Attachments & Cloudinary Storage',
      content:
        'Images and documents uploaded within direct messages are securely stored using Cloudinary’s encrypted CDN infrastructure. Uploaded media is tied exclusively to your authenticated chat conversation and never shared publicly.'
    },
    {
      id: 'webrtc-privacy',
      title: '3. WebRTC Video Session Privacy',
      content:
        'SkillSwap 1-on-1 video calls utilize WebRTC peer-to-peer connections. Video and audio streams flow directly between participants and are never recorded, analyzed, or stored on SkillSwap servers.'
    },
    {
      id: 'cookies',
      title: '4. Local Storage & JWT Tokens',
      content:
        'We use secure browser LocalStorage and HTTP cookies to maintain your login session (JWT authentication tokens) and user preference settings. We do not use third-party tracking cookies.'
    },
    {
      id: 'user-rights',
      title: '5. Your Rights & Data Erasure',
      content:
        'You have full control over your personal data. You may update your profile details, export your account data, or request permanent deletion of your account and messages at any time by contacting audwitiyabandyopadhyay74@zohomail.in.'
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

      {/* Header */}
      <section className="relative pt-36 pb-16 px-6 max-w-4xl mx-auto w-full text-center z-10">
        <span className="gsap-hero text-xs font-mono font-bold uppercase tracking-widest text-[#A78BFA] bg-[#A78BFA]/10 px-4 py-1.5 rounded-full border border-[#A78BFA]/30 mb-6 inline-block">
          Data Protection
        </span>
        <h1 className="gsap-hero text-4xl md:text-5xl font-black tracking-tight leading-tight text-white mb-4">
          Privacy Policy
        </h1>
        <p className="gsap-hero text-white/60 text-sm font-mono">Last Updated: September 10, 2026</p>
      </section>

      {/* Content */}
      <section className="px-6 max-w-4xl mx-auto w-full mb-24 z-10">
        <div className="p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 space-y-8">
          {sections.map((sec) => (
            <div key={sec.id} className="gsap-section space-y-3 pb-6 border-b border-white/10 last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-[#A78BFA]">{sec.title}</h2>
              <p className="text-sm text-white/80 leading-relaxed font-sans">{sec.content}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

