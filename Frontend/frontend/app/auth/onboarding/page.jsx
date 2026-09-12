'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Topography from '../../components/backgrounds/Topography';
import Stepper, { Step } from '../../components/ui/Stepper';
import { usersAPI } from '../../lib/api';
import { useToast } from '../../components/ToastContext';
import { FaCheck } from 'react-icons/fa';

const OFFERED_SUGGESTIONS = [
  'React', 'Node.js', 'Python', 'UI/UX Design', 'TypeScript',
  'Data Science', 'Digital Marketing', 'Graphic Design', 'Video Editing', 'Public Speaking'
];

const WANTED_SUGGESTIONS = [
  'Next.js', 'Machine Learning', 'Spanish', 'SEO', 'Product Management',
  'Copywriting', 'Guitar', 'Financial Planning', 'Illustration', 'App Development'
];

export default function OnboardingPage() {
  const containerRef = useRef(null);
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [offered, setOffered] = useState([]);
  const [wanted, setWanted] = useState([]);
  const [customOffered, setCustomOffered] = useState('');
  const [customWanted, setCustomWanted] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  useGSAP(() => {
    gsap.fromTo(
      '.gsap-onboarding-card',
      { scale: 0.92, opacity: 0, y: 35 },
      { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'back.out(1.2)' }
    );
  }, { scope: containerRef });

  useEffect(() => {
    const token = localStorage.getItem('ss_token');
    const storedUser = localStorage.getItem('ss_user');
    if (!token) {
      router.replace('/auth/login');
      return;
    }
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      if (u.skillsOffered?.length) setOffered(u.skillsOffered);
      if (u.skillsWanted?.length) setWanted(u.skillsWanted);
      if (u.bio) setBio(u.bio);
    }
  }, [router]);

  const toggleOffered = (skill) => {
    setOffered((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleWanted = (skill) => {
    setWanted((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomOffered = (e) => {
    e.preventDefault();
    if (customOffered.trim() && !offered.includes(customOffered.trim())) {
      setOffered([...offered, customOffered.trim()]);
      setCustomOffered('');
    }
  };

  const addCustomWanted = (e) => {
    e.preventDefault();
    if (customWanted.trim() && !wanted.includes(customWanted.trim())) {
      setWanted([...wanted, customWanted.trim()]);
      setCustomWanted('');
    }
  };

  const handleFinalStep = async () => {
    setSaving(true);
    try {
      const updated = await usersAPI.updateProfile({
        skillsOffered: offered,
        skillsWanted: wanted,
        bio: bio.trim(),
      });
      localStorage.setItem('ss_user', JSON.stringify(updated.user || updated));
      toast.success('Your profile setup is complete! Welcome to SkillSwap');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Profile setup failed. Navigating to dashboard...');
      router.push('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={containerRef} className="w-screen h-screen flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-[-10]">
        <Topography
          lowColor="#5227FF"
          midColor="#FF9FFC"
          speed={0.35}
          morphAmount={3}
          morphSpeed={0.05}
          bands={2}
          thickness={0.01}
          scale={2}
          pixelSize={1}
          glow={0.5}
          colorMode="elevation"
          contrast={3}
          brightness={1}
          fillBands={false}
          opacity={1}
          grain
          grainIntensity={0.05}
          mouseInteraction
          mouseRadius={0.3}
          mouseStrength={0.4}
        />
      </div>

      <div className="gsap-onboarding-card w-full max-w-2xl px-4 z-10">
        <div className="text-center mb-4">
          <span className="px-3 py-1 rounded-full bg-[#00ff62]/10 border border-[#00ff62]/30 text-[#00ff62] text-xs font-mono font-bold tracking-widest uppercase">
            Step 2 of 2 — Skill Setup
          </span>
          <h1 className="text-3xl font-extrabold text-white font-mono mt-2">
            Welcome, {user?.name || 'Explorer'}!
          </h1>
          <p className="text-white/40 text-xs font-mono mt-1">
            Let&apos;s personalize your SkillSwap exchange profile
          </p>
        </div>

        <Stepper
          initialStep={1}
          onFinalStepCompleted={handleFinalStep}
          backButtonText="Back"
          nextButtonText="Continue"
        >
          <Step>
            <div className="space-y-4 px-2">
              <div>
                <h2 className="text-lg font-bold text-white font-mono">1. What Skills Can You Teach?</h2>
                <p className="text-xs text-white/50">Select skills you are proficient in and willing to share</p>
              </div>

              <div className="flex flex-wrap gap-2 py-2 max-h-36 overflow-y-auto">
                {OFFERED_SUGGESTIONS.map((skill) => {
                  const active = offered.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleOffered(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${active
                        ? 'bg-[#00ff62] text-black shadow-[0_0_15px_rgba(0,255,98,0.4)]'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                        }`}
                    >
                      {active ? <FaCheck className="inline-block mr-1" /> : '+ '} {skill}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={addCustomOffered} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom skill (e.g. Figma)"
                  value={customOffered}
                  onChange={(e) => setCustomOffered(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#00ff62]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-mono text-xs hover:bg-white/20 cursor-pointer"
                >
                  Add
                </button>
              </form>
            </div>
          </Step>

          <Step>
            <div className="space-y-4 px-2">
              <div>
                <h2 className="text-lg font-bold text-white font-mono">2. What Skills Do You Want to Learn?</h2>
                <p className="text-xs text-white/50">Select subjects or techniques you want guidance on</p>
              </div>

              <div className="flex flex-wrap gap-2 py-2 max-h-36 overflow-y-auto">
                {WANTED_SUGGESTIONS.map((skill) => {
                  const active = wanted.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleWanted(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${active
                        ? 'bg-[#00ff62] text-black shadow-[0_0_15px_rgba(0,255,98,0.4)]'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                        }`}
                    >
                      {active ? <FaCheck className="inline-block mr-1" /> : '+ '} {skill}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={addCustomWanted} className="flex gap-2 px-10">
                <input
                  type="text"
                  placeholder="Add custom skill (e.g. Machine Learning)"
                  value={customWanted}
                  onChange={(e) => setCustomWanted(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#00ff62]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-mono text-xs hover:bg-white/20 cursor-pointer"
                >
                  Add
                </button>
              </form>
            </div>
          </Step>

          <Step>
            <div className="space-y-4 px-2">
              <div>
                <h2 className="text-lg font-bold text-white font-mono">3. Introduce Yourself</h2>
                <p className="text-xs text-white/50">Write a quick intro for potential skill swap partners</p>
              </div>

              <textarea
                rows={4}
                placeholder="Hi, I'm a full-stack dev eager to swap programming tips for UI design feedback..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#00ff62] resize-none"
              />
            </div>
          </Step>

          <Step>
            <div className="text-center py-4 space-y-3 px-10">
              <div className="w-14 h-14 rounded-full bg-[#00ff62]/20 border border-[#00ff62] flex items-center justify-center mx-auto text-[#00ff62] font-black text-2xl animate-bounce">
                <FaCheck />
              </div>
              <h2 className="text-xl font-bold text-white font-mono">You&apos;re All Set!</h2>
              <p className="text-xs text-white/60 max-w-sm mx-auto">
                Your skills have been saved. Click below to launch your dashboard and start swapping skills live!
              </p>
            </div>
          </Step>
        </Stepper>
      </div>
    </div>
  );
}
