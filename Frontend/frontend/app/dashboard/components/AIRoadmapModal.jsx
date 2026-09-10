'use client';
import React, { useState } from 'react';
import { aiAPI } from '../../lib/api';
import { FaTimes, FaMagic, FaGraduationCap, FaCalendarWeek, FaCheckCircle, FaRocket } from 'react-icons/fa';
import BorderGlow from '../../components/BorderGlow';
import { useToast } from '../../components/ToastContext';

export default function AIRoadmapModal({ initialSkill = '', onClose }) {
  const toast = useToast();
  const [skill, setSkill] = useState(initialSkill || '');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!skill.trim()) {
      toast.error('Please enter a skill topic!');
      return;
    }

    setLoading(true);
    try {
      toast.info(`Gemini AI is generating your learning roadmap for ${skill}...`);
      const data = await aiAPI.generateRoadmap({ skill: skill.trim() });
      if (data.roadmap) {
        setRoadmap(data.roadmap);
        toast.success(`✨ Roadmap generated for ${skill}!`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[100] flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
      <BorderGlow
        backgroundColor="#101018"
        borderRadius={32}
        glowColor="143 100 50"
        glowIntensity={1.4}
        edgeSensitivity={35}
        colors={['#8b5cf6', '#00ff62', '#3b82f6']}
        className="w-full max-w-2xl max-h-[90vh] shadow-[0_30px_70px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col"
      >
        <div className="p-6 md:p-8 space-y-6 relative z-10 overflow-y-auto max-h-[85vh] custom-scrollbar">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                  <FaMagic className="text-xs" /> Gemini AI Powered
                </span>
              </div>
              <h3 className="text-white font-black text-2xl tracking-tight flex items-center gap-2">
                <FaGraduationCap className="text-[#00ff62]" /> AI Skill Exchange Roadmap
              </h3>
              <p className="text-white/40 text-xs">
                Generate a structured 4-week peer-learning curriculum using Google Gemini AI
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/50 hover:text-white flex items-center justify-center transition-all duration-300 hover:rotate-90 cursor-pointer shadow-md flex-shrink-0"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleGenerate} className="flex gap-2">
            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="e.g. Python for Data Science, Next.js, UI/UX Design, Guitar..."
              className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-xs md:text-sm outline-none focus:border-[#00ff62] focus:bg-black/70 focus:shadow-[0_0_15px_rgba(0,255,98,0.2)] placeholder:text-white/20 transition-all font-sans"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-[#00ff62] text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2 flex-shrink-0"
            >
              {loading ? (
                <span>Generating...</span>
              ) : (
                <>
                  <FaMagic />
                  <span>Generate</span>
                </>
              )}
            </button>
          </form>

          {/* Roadmap Result */}
          {roadmap && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 pt-2">
              <div className="bg-gradient-to-br from-purple-950/40 via-[#12121e] to-black/60 p-5 rounded-2xl border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[#00ff62] font-black text-lg">{roadmap.skill} Roadmap</h4>
                  <span className="text-[10px] font-mono font-bold bg-[#00ff62]/15 text-[#00ff62] px-3 py-1 rounded-full border border-[#00ff62]/30">
                    4 Weeks Plan
                  </span>
                </div>
                <p className="text-white/70 text-xs leading-relaxed italic">{roadmap.overview}</p>
              </div>

              <div className="space-y-4">
                {(roadmap.weeks || []).map((week, idx) => (
                  <div
                    key={idx}
                    className="bg-[#12121a] p-5 rounded-2xl border border-white/[0.08] hover:border-[#00ff62]/30 transition-all space-y-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-[#00ff62]/15 text-[#00ff62] font-mono font-black text-xs flex items-center justify-center border border-[#00ff62]/30">
                          0{week.weekNumber || idx + 1}
                        </span>
                        <h5 className="text-white font-black text-sm">{week.title}</h5>
                      </div>
                      <span className="text-white/30 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1">
                        <FaCalendarWeek /> Week {week.weekNumber || idx + 1}
                      </span>
                    </div>

                    {week.goals && week.goals.length > 0 && (
                      <div className="space-y-1.5 pl-2">
                        <p className="text-white/40 text-[10px] font-mono font-bold uppercase">Learning Goals:</p>
                        {week.goals.map((g, gi) => (
                          <div key={gi} className="flex items-start gap-2 text-xs text-white/80">
                            <FaCheckCircle className="text-[#00ff62] text-xs mt-0.5 flex-shrink-0" />
                            <span>{g}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {week.practiceSession && (
                      <div className="bg-black/50 p-3 rounded-xl border border-white/5 space-y-1">
                        <p className="text-purple-400 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                          <FaRocket /> Recommended 1-on-1 Practice Session:
                        </p>
                        <p className="text-white/80 text-xs italic">{week.practiceSession}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </BorderGlow>
    </div>
  );
}
