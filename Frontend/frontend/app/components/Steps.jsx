"use client";
import React from 'react';
import { FaRocket, FaPen, FaCommentDots } from 'react-icons/fa';

const Steps = () => {
  const steps = [
    {
      num: '01',
      badge: '01 — Getting Started',
      title: 'Setup Your Account',
      desc: "Create your profile in seconds. Tell us what you want to teach or learn, and we'll handle the rest.",
      icon: FaRocket,
      bg: 'from-slate-900 via-slate-800 to-indigo-950/80 border-indigo-500/30',
      glow: 'bg-indigo-500/20',
      progress: 'w-1/3 bg-indigo-400',
    },
    {
      num: '02',
      badge: '02 — Create Request',
      title: 'Create Your Request',
      desc: 'Post what you need — a tutor, a skill, a session. Our smart matching connects you with the right person instantly.',
      icon: FaPen,
      bg: 'from-blue-950 via-indigo-900 to-violet-950 border-cyan-500/30',
      glow: 'bg-cyan-400/20',
      progress: 'w-2/3 bg-cyan-400',
    },
    {
      num: '03',
      badge: '03 — Connect & Learn',
      title: 'Connect & Learn Together',
      desc: 'Hop on HD video call or chat, share your knowledge, and start learning. Your journey begins here.',
      icon: FaCommentDots,
      bg: 'from-purple-950 via-slate-900 to-rose-950/80 border-purple-500/30',
      glow: 'bg-purple-500/20',
      progress: 'w-full bg-[#00ff62]',
    },
  ];

  return (
    <section className="w-full bg-[#07070a] py-24 md:py-32 px-4 md:px-12 lg:px-20 relative overflow-hidden text-white">
      {/* Background ambient glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#00ff62]/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-[#00ff62]/10 border border-[#00ff62]/30 text-[#00ff62] text-xs font-mono font-semibold uppercase tracking-widest">
            Simple 3-Step Journey
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            Steps to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff62] via-emerald-300 to-cyan-400">Start</span>
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto">
            Three simple steps to unlock endless peer-to-peer learning opportunities.
          </p>
        </div>

        {/* 3-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`relative group rounded-[32px] p-8 md:p-10 bg-gradient-to-br ${step.bg} border backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between min-h-[400px] overflow-hidden`}
              >
                {/* Internal Glow Effect */}
                <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full ${step.glow} blur-[80px] pointer-events-none transition-all duration-500 group-hover:scale-150`} />

                {/* Card Top */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-white/80 text-xs font-semibold tracking-wide">
                      {step.badge}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
                      <Icon />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-white/65 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Card Bottom Progress */}
                <div className="pt-8 space-y-3 border-t border-white/10 mt-6">
                  <div className="flex items-center justify-between text-xs font-mono text-white/40">
                    <span>PROGRESS</span>
                    <span className="text-white/70 font-bold">{idx + 1} / 3</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full ${step.progress} rounded-full transition-all duration-500`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Steps;
