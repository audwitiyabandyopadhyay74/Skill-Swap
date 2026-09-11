'use client';
import React, { useState } from 'react';
import { aiAPI } from '../../lib/api';
import {
  FaTimes,
  FaMagic,
  FaGraduationCap,
  FaCalendarWeek,
  FaCheckCircle,
  FaRocket,
  FaLightbulb,
  FaPenNib,
  FaCopy,
  FaCheck,
  FaFire,
  FaExchangeAlt,
} from 'react-icons/fa';
import BorderGlow from '../../components/BorderGlow';
import { useToast } from '../../components/ToastContext';

export default function AIRoadmapModal({ initialSkill = '', onClose, onApplyPost }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap', 'ideas', 'pitch'

  // Tab 1: Roadmap State
  const [roadmapSkill, setRoadmapSkill] = useState(initialSkill || '');
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);

  // Tab 2: Ideas State
  const [mySkills, setMySkills] = useState('');
  const [wantSkills, setWantSkills] = useState('');
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideasData, setIdeasData] = useState([]);

  // Tab 3: Pitch State
  const [pitchTopic, setPitchTopic] = useState('');
  const [pitchOffered, setPitchOffered] = useState('');
  const [pitchNeeded, setPitchNeeded] = useState('');
  const [pitchLoading, setPitchLoading] = useState(false);
  const [pitchResult, setPitchResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Preset Chips
  const QUICK_SKILLS = [
    'Python & AI',
    'UI/UX & Figma',
    'React & Next.js',
    'Guitar & Music',
    'Spanish Conversation',
    'Public Speaking',
  ];

  // Handlers
  const handleGenerateRoadmap = async (e) => {
    e?.preventDefault();
    if (!roadmapSkill.trim()) {
      toast.error('Please enter a skill topic!');
      return;
    }
    setRoadmapLoading(true);
    try {
      toast.info(`Gemini AI is crafting your learning roadmap for "${roadmapSkill}"...`);
      const data = await aiAPI.generateRoadmap({ skill: roadmapSkill.trim() });
      if (data.roadmap) {
        setRoadmapData(data.roadmap);
        toast.success(`✨ 4-Week Roadmap generated!`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to generate roadmap');
    } finally {
      setRoadmapLoading(false);
    }
  };

  const handleGenerateIdeas = async (e) => {
    e?.preventDefault();
    setIdeasLoading(true);
    try {
      toast.info('Gemini AI is brainstorming creative skill swap ideas...');
      const data = await aiAPI.generateSwapIdeas({
        userSkills: mySkills,
        interests: wantSkills,
      });
      if (data.ideas) {
        setIdeasData(data.ideas);
        toast.success(`✨ Generated ${data.ideas.length} swap ideas!`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to generate swap ideas');
    } finally {
      setIdeasLoading(false);
    }
  };

  const handleGeneratePitch = async (e) => {
    e?.preventDefault();
    if (!pitchTopic && !pitchOffered && !pitchNeeded) {
      toast.error('Please fill in at least one field to craft a pitch!');
      return;
    }
    setPitchLoading(true);
    try {
      toast.info('Gemini AI is writing your high-converting exchange pitch...');
      const data = await aiAPI.generatePost({
        topic: pitchTopic,
        skillOffered: pitchOffered,
        skillNeeded: pitchNeeded,
      });
      if (data.result) {
        setPitchResult(data.result);
        toast.success('✨ Exchange pitch generated!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to generate pitch');
    } finally {
      setPitchLoading(false);
    }
  };

  const handleCopyPitch = () => {
    if (!pitchResult) return;
    const textToCopy = `Title: ${pitchResult.title}\n\nDescription: ${pitchResult.description}\n\nTags: ${pitchResult.tags?.join(', ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Copied pitch to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[100] flex items-center justify-center p-3 md:p-6 font-sans animate-in fade-in duration-200">
      <BorderGlow
        backgroundColor="#0e0e16"
        borderRadius={36}
        glowColor="143 100 50"
        glowIntensity={1.5}
        edgeSensitivity={40}
        colors={['#00ff62', '#8b5cf6', '#3b82f6', '#ec4899']}
        className="w-full max-w-3xl max-h-[92vh] shadow-[0_40px_90px_rgba(0,0,0,0.95)] relative overflow-hidden flex flex-col"
      >
        {/* Ambient Top Radial Glow */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#00ff62]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="p-5 md:p-8 space-y-6 relative z-10 overflow-y-auto max-h-[88vh] custom-scrollbar">
          {/* Top Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-[#00ff62]/20 text-[#00ff62] border border-[#00ff62]/40 text-[10px] font-mono font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,98,0.25)]">
                  <FaMagic className="text-xs text-purple-400 animate-pulse" /> Gemini AI Command Center
                </span>
                <span className="text-white/30 text-xs font-mono hidden sm:inline">• Live AI Assistant</span>
              </div>
              <h2 className="text-white font-black text-2xl md:text-3xl tracking-tight flex items-center gap-2.5">
                Google Gemini AI Co-Pilot
              </h2>
              <p className="text-white/50 text-xs md:text-sm max-w-xl leading-relaxed">
                Supercharge your peer exchanges with AI learning roadmaps, custom swap ideas, and auto-crafted exchange pitches.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/50 hover:text-white flex items-center justify-center transition-all duration-300 hover:rotate-90 cursor-pointer shadow-lg flex-shrink-0"
            >
              <FaTimes className="text-base" />
            </button>
          </div>

          {/* Luxury Tab Switcher */}
          <div className="grid grid-cols-3 bg-[#08080f] p-1.5 rounded-2xl border border-white/[0.08] gap-1 shadow-inner">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`py-3 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'roadmap'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaGraduationCap className="text-sm" />
              <span>Learning Roadmap</span>
            </button>

            <button
              onClick={() => setActiveTab('ideas')}
              className={`py-3 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'ideas'
                  ? 'bg-gradient-to-r from-[#00ff62] to-emerald-400 text-black shadow-[0_0_20px_rgba(0,255,98,0.4)]'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaLightbulb className="text-sm" />
              <span>Swap Idea Matcher</span>
            </button>

            <button
              onClick={() => setActiveTab('pitch')}
              className={`py-3 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'pitch'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaPenNib className="text-sm" />
              <span>Pitch Crafter</span>
            </button>
          </div>

          {/* TAB 1: LEARNING ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <form onSubmit={handleGenerateRoadmap} className="space-y-4">
                <div>
                  <label className="text-white/60 text-[11px] font-mono font-extrabold uppercase tracking-wider block mb-2">
                    Enter any skill topic you want to learn or teach:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={roadmapSkill}
                      onChange={(e) => setRoadmapSkill(e.target.value)}
                      placeholder="e.g. Python for Data Science, Next.js, UI/UX Design, Guitar..."
                      className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-xs md:text-sm outline-none focus:border-[#00ff62] focus:shadow-[0_0_15px_rgba(0,255,98,0.2)] placeholder:text-white/20 transition-all font-sans"
                    />
                    <button
                      type="submit"
                      disabled={roadmapLoading}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-[#00ff62] text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2 flex-shrink-0"
                    >
                      {roadmapLoading ? 'Generating...' : <><FaMagic /> Generate</>}
                    </button>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] text-white/40 font-mono font-bold">Try quick topic:</span>
                  {QUICK_SKILLS.map((qs) => (
                    <button
                      key={qs}
                      type="button"
                      onClick={() => {
                        setRoadmapSkill(qs);
                        handleGenerateRoadmap();
                      }}
                      className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white text-xs transition cursor-pointer font-mono"
                    >
                      {qs}
                    </button>
                  ))}
                </div>
              </form>

              {/* Roadmap Result */}
              {roadmapData && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300 pt-2 border-t border-white/[0.08]">
                  <div className="bg-gradient-to-br from-purple-950/40 via-[#12121e] to-black/60 p-5 rounded-2xl border border-purple-500/20 space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[#00ff62] font-black text-lg">{roadmapData.skill} Curriculum</h4>
                      <span className="text-[10px] font-mono font-black bg-[#00ff62]/15 text-[#00ff62] px-3 py-1 rounded-full border border-[#00ff62]/30 uppercase">
                        4-Week Plan
                      </span>
                    </div>
                    <p className="text-white/70 text-xs leading-relaxed italic">{roadmapData.overview}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(roadmapData.weeks || []).map((week, idx) => (
                      <div
                        key={idx}
                        className="bg-[#12121a] p-5 rounded-2xl border border-white/[0.08] hover:border-[#00ff62]/40 transition-all space-y-3 shadow-lg flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="w-7 h-7 rounded-xl bg-[#00ff62]/15 text-[#00ff62] font-mono font-black text-xs flex items-center justify-center border border-[#00ff62]/30">
                              0{week.weekNumber || idx + 1}
                            </span>
                            <span className="text-white/30 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1">
                              <FaCalendarWeek /> Week {week.weekNumber || idx + 1}
                            </span>
                          </div>

                          <h5 className="text-white font-black text-sm">{week.title}</h5>

                          {week.goals && week.goals.length > 0 && (
                            <div className="space-y-1.5">
                              {week.goals.map((g, gi) => (
                                <div key={gi} className="flex items-start gap-2 text-xs text-white/80">
                                  <FaCheckCircle className="text-[#00ff62] text-xs mt-0.5 flex-shrink-0" />
                                  <span>{g}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {week.practiceSession && (
                          <div className="bg-black/50 p-3 rounded-xl border border-white/5 space-y-1 mt-2">
                            <p className="text-purple-400 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                              <FaRocket /> 1-on-1 Practice Session:
                            </p>
                            <p className="text-white/80 text-[11px] italic">{week.practiceSession}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SWAP IDEA MATCHER */}
          {activeTab === 'ideas' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <form onSubmit={handleGenerateIdeas} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#00ff62] text-[11px] font-mono font-extrabold uppercase tracking-wider block mb-1.5">
                      Skills You Can Teach / Offer
                    </label>
                    <input
                      type="text"
                      value={mySkills}
                      onChange={(e) => setMySkills(e.target.value)}
                      placeholder="e.g. Web Development, Photography, Spanish"
                      className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs md:text-sm outline-none focus:border-[#00ff62] transition"
                    />
                  </div>

                  <div>
                    <label className="text-indigo-400 text-[11px] font-mono font-extrabold uppercase tracking-wider block mb-1.5">
                      Skills You Want To Learn
                    </label>
                    <input
                      type="text"
                      value={wantSkills}
                      onChange={(e) => setWantSkills(e.target.value)}
                      placeholder="e.g. AI Prompt Engineering, Piano, Video Editing"
                      className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs md:text-sm outline-none focus:border-indigo-400 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={ideasLoading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00ff62] to-emerald-400 text-black font-black text-xs uppercase tracking-wider hover:opacity-95 transition cursor-pointer disabled:opacity-50 shadow-[0_0_25px_rgba(0,255,98,0.35)] flex items-center justify-center gap-2"
                >
                  {ideasLoading ? 'Gemini AI Brainstorming...' : <><FaLightbulb /> Match Creative Swap Ideas</>}
                </button>
              </form>

              {/* Ideas Result */}
              {ideasData.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-white/[0.08]">
                  <h4 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    <FaFire className="text-amber-400" /> Gemini AI Recommended Exchanges ({ideasData.length})
                  </h4>

                  <div className="space-y-3.5">
                    {ideasData.map((idea, idx) => (
                      <div
                        key={idx}
                        className="bg-[#12121a] p-5 rounded-2xl border border-white/[0.08] hover:border-[#00ff62]/40 transition space-y-3 shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="text-white font-black text-base">{idea.title}</h5>
                          <span className="text-[10px] font-mono font-bold bg-[#00ff62]/10 text-[#00ff62] px-2.5 py-0.5 rounded-full border border-[#00ff62]/30">
                            Idea #{idx + 1}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                            <span className="text-white/40 text-[10px] font-mono uppercase block">You Offer:</span>
                            <span className="text-[#00ff62] font-bold">{idea.offering}</span>
                          </div>
                          <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                            <span className="text-white/40 text-[10px] font-mono uppercase block">You Learn:</span>
                            <span className="text-indigo-300 font-bold">{idea.learning}</span>
                          </div>
                        </div>

                        <p className="text-white/70 text-xs italic">{idea.whyItWorks}</p>

                        {idea.icebreaker && (
                          <div className="bg-purple-950/30 p-3 rounded-xl border border-purple-500/20 text-xs text-purple-200">
                            <strong className="text-purple-400 font-mono text-[10px] block uppercase">💡 First Session Icebreaker:</strong>
                            &quot;{idea.icebreaker}&quot;
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PITCH CRAFTER */}
          {activeTab === 'pitch' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <form onSubmit={handleGeneratePitch} className="space-y-4">
                <div>
                  <label className="text-white/60 text-[11px] font-mono font-extrabold uppercase tracking-wider block mb-1.5">
                    Topic / Core Concept Idea
                  </label>
                  <input
                    type="text"
                    value={pitchTopic}
                    onChange={(e) => setPitchTopic(e.target.value)}
                    placeholder="e.g. Learn Python for Data Science by teaching Web Design"
                    className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs md:text-sm outline-none focus:border-pink-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#00ff62] text-[11px] font-mono font-extrabold uppercase tracking-wider block mb-1.5">
                      Skill Offered
                    </label>
                    <input
                      type="text"
                      value={pitchOffered}
                      onChange={(e) => setPitchOffered(e.target.value)}
                      placeholder="e.g. Web Design"
                      className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs md:text-sm outline-none focus:border-[#00ff62] transition"
                    />
                  </div>
                  <div>
                    <label className="text-indigo-400 text-[11px] font-mono font-extrabold uppercase tracking-wider block mb-1.5">
                      Skill Needed
                    </label>
                    <input
                      type="text"
                      value={pitchNeeded}
                      onChange={(e) => setPitchNeeded(e.target.value)}
                      placeholder="e.g. Python"
                      className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs md:text-sm outline-none focus:border-indigo-400 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={pitchLoading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs uppercase tracking-wider hover:opacity-95 transition cursor-pointer disabled:opacity-50 shadow-[0_0_25px_rgba(236,72,153,0.35)] flex items-center justify-center gap-2"
                >
                  {pitchLoading ? 'Gemini AI Writing Pitch...' : <><FaPenNib /> Craft Exchange Pitch</>}
                </button>
              </form>

              {/* Pitch Result */}
              {pitchResult && (
                <div className="space-y-4 pt-2 border-t border-white/[0.08] animate-in fade-in duration-300">
                  <div className="bg-[#12121c] p-6 rounded-3xl border border-pink-500/30 space-y-4 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full border border-pink-500/30 uppercase">
                        AI High-Converting Pitch
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyPitch}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        {copied ? <><FaCheck className="text-[#00ff62]" /> Copied!</> : <><FaCopy /> Copy Text</>}
                      </button>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-white font-black text-lg">{pitchResult.title}</h4>
                      <p className="text-white/80 text-xs leading-relaxed bg-black/50 p-4 rounded-2xl border border-white/5">
                        {pitchResult.description}
                      </p>
                    </div>

                    {pitchResult.tags && pitchResult.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {pitchResult.tags.map((t, idx) => (
                          <span key={idx} className="text-[10px] font-mono text-[#00ff62] bg-[#00ff62]/10 px-2.5 py-1 rounded-lg border border-[#00ff62]/20">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </BorderGlow>
    </div>
  );
}
