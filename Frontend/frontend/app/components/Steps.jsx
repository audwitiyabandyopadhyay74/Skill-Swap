"use client";
import React from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { FaRocket, FaPen, FaCommentDots } from 'react-icons/fa';

const Steps = () => {
  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen relative overflow-hidden text-white">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none z-0" />

      <ScrollStack
        itemDistance={60}
        itemScale={0.05}
        itemStackDistance={50}
        stackPosition="20%"
        scaleEndPosition="15%"
        baseScale={0.82}
        rotationAmount={0.2}
        blurAmount={2}
      >
        <div className="text-center mb-20 mt-10">
          <h1 className="text-6xl font-bold text-white tracking-tight mb-3">
            Steps to Start
          </h1>
          <p className="text-white/40 text-lg">
            Three simple steps to begin your journey
          </p>
        </div>

        <ScrollStackItem
          itemClassName="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ring-1 ring-white/10 overflow-hidden h-[450px]"
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-indigo-500/25 blur-[80px] pointer-events-none" />
          <div className="relative flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/70 text-sm font-medium tracking-wide">
                01 — Getting Started
              </span>
              <FaRocket className="text-4xl text-indigo-400" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight tracking-tight mb-3">
                Setup Your Account
              </h2>
              <p className="text-base text-white/50 max-w-md leading-relaxed">
                Create your profile in seconds. Tell us what you want to teach or learn, and we'll handle the rest.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-1/3 bg-indigo-400 rounded-full" />
              </div>
              <span className="text-white/30 text-sm font-medium">1 / 3</span>
            </div>
          </div>
        </ScrollStackItem>

        {/* Step 2 */}
        <ScrollStackItem
          itemClassName="bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-800 ring-1 ring-white/20 overflow-hidden h-[450px]"
        >
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-cyan-400/25 blur-[80px] pointer-events-none" />
          <div className="relative flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white/90 text-sm font-medium tracking-wide">
                02 — Create
              </span>
              <FaPen className="text-4xl text-cyan-300" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight tracking-tight mb-3">
                Create Your Request
              </h2>
              <p className="text-base text-white/60 max-w-md leading-relaxed">
                Post what you need — a tutor, a skill, a session. Our smart matching connects you with the right person instantly.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1 flex-1 rounded-full bg-white/15 overflow-hidden">
                <div className="h-full w-2/3 bg-white rounded-full" />
              </div>
              <span className="text-white/50 text-sm font-medium">2 / 3</span>
            </div>
          </div>
        </ScrollStackItem>

        {/* Step 3 */}
        <ScrollStackItem
          itemClassName="bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 ring-1 ring-white/20 overflow-hidden h-[450px]"
        >
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-yellow-300/30 blur-[80px] pointer-events-none" />
          <div className="relative flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white/90 text-sm font-medium tracking-wide">
                03 — Connect
              </span>
              <FaCommentDots className="text-4xl text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight tracking-tight mb-3">
                Connect & Learn Together
              </h2>
              <p className="text-base text-white/70 max-w-md leading-relaxed">
                Hop on chat or meet, share your knowledge, and start learning. Your journey begins here.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full w-full bg-white rounded-full" />
              </div>
              <span className="text-white/70 text-sm font-medium">3 / 3</span>
            </div>
          </div>
        </ScrollStackItem>
      </ScrollStack>
    </div>
  );
};

export default Steps;
