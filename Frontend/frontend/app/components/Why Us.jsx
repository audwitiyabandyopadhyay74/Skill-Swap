'use client';
import React, { useRef } from 'react';
import LaserFlow from './LaserFlow';

export default function WhyUs() {
  const revealImgRef = useRef(null);

  return (
    <div className="w-full min-h-screen py-20 px-6 flex flex-col items-center justify-center relative overflow-hidden bg-[#0a0a0f] text-white">
      {/* Title */}
      <div className="text-center mb-12 z-10">
        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
          Why Choose <span className="text-[#FF79C6]">SkillSwap</span>
        </h2>
        <p className="text-white/40 text-sm md:text-base mt-2 max-w-lg mx-auto font-mono">
          Powered by real-time WebRTC, WebGL Aurora & LaserFlow graphics
        </p>
      </div>

      {/* LaserFlow Interactive Container */}
      <div
        className="w-full max-w-5xl h-[500px] md:h-[600px] relative rounded-3xl overflow-hidden border border-[#FF79C6]/30 shadow-2xl bg-[#0e0c15]"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const el = revealImgRef.current;
          if (el) {
            el.style.setProperty('--mx', `${x}px`);
            el.style.setProperty('--my', `${y}px`);
          }
        }}
        onMouseLeave={() => {
          const el = revealImgRef.current;
          if (el) {
            el.style.setProperty('--mx', '-9999px');
            el.style.setProperty('--my', '-9999px');
          }
        }}
      >
        <LaserFlow
          horizontalBeamOffset={0.1}
          verticalBeamOffset={0.0}
          color="#FF79C6"
          fogIntensity={0.5}
          flowSpeed={0.4}
          wispDensity={1.2}
          mouseTiltStrength={0.015}
        />

        {/* Floating Content Card over LaserFlow */}
        <div className="absolute inset-x-6 top-[20%] md:top-[25%] max-w-3xl mx-auto bg-black/60 backdrop-blur-xl border border-[#FF79C6]/40 p-8 rounded-3xl z-10 text-center shadow-2xl space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF79C6] bg-[#FF79C6]/10 px-3 py-1 rounded-full border border-[#FF79C6]/30">
            Interactive Skill Network
          </span>
          <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
            Exchange Knowledge. Boost Expertise. Free Forever.
          </h3>
          <p className="text-white/70 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-sans">
            SkillSwap connects passionate learners and experts worldwide. Teach what you know, learn what you love—with HD video calling, mutual meeting scheduling, and real-time chat.
          </p>
        </div>
      </div>
    </div>
  );
}
