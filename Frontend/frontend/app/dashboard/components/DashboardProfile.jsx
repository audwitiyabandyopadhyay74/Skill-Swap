'use client';
import { useState } from 'react';
import { usersAPI } from '../../lib/api';
import { FaTimes, FaCheck } from 'react-icons/fa';

import SkillInputAuto from '../../components/SkillInput';

const SkillListInput = ({ label, skills, setSkills, color }) => {
  const [val, setVal] = useState('');
  const add = () => {
    const trimmed = val.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setVal('');
  };
  const remove = (s) => setSkills(skills.filter((x) => x !== s));

  return (
    <div>
      <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2">{label}</p>
      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <SkillInputAuto
            value={val}
            onChange={(newVal) => setVal(newVal)}
            placeholder={`Add ${label.toLowerCase()}...`}
          />
        </div>
        <button
          type="button"
          onClick={add}
          className="px-4 py-2.5 rounded-xl bg-[#00ff62]/10 text-[#00ff62] font-black text-xs border border-[#00ff62]/30 hover:bg-[#00ff62] hover:text-black cursor-pointer transition shadow-md"
        >
          + Add
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {skills.map((s) => (
          <span key={s} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
            {s}
            <button onClick={() => remove(s)} className="hover:opacity-60 cursor-pointer"><FaTimes /></button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default function DashboardProfile({ user, setUser }) {
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skillsOffered, setSkillsOffered] = useState(user?.skillsOffered || []);
  const [skillsWanted, setSkillsWanted] = useState(user?.skillsWanted || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const pts = user?.points || 100;
  let badge = user?.badge || '🥉 Bronze Swapper';
  if (pts >= 1000) badge = '💎 Diamond Master';
  else if (pts >= 500) badge = '🥇 Gold Swapper';
  else if (pts >= 250) badge = '🥈 Silver Swapper';

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = await usersAPI.updateProfile({ name, bio, skillsOffered, skillsWanted });
      setUser(data.user);
      localStorage.setItem('ss_user', JSON.stringify(data.user));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="p-4 md:p-8 max-w-2xl font-sans">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white">My Profile</h1>
        <p className="text-white/40 text-sm mt-1">Manage your skills, friends, and awards</p>
      </div>
      <div className="flex items-center gap-5 mb-6 p-5 bg-[#141414] border border-white/[0.07] rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff62]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg">
          {initials}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-white font-black text-lg">{name || 'Your Name'}</p>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00ff62]/15 text-[#00ff62] border border-[#00ff62]/30 text-[10px] font-mono font-bold">
              {badge}
            </span>
          </div>
          <p className="text-white/30 text-xs font-mono">{user?.email}</p>
          <div className="flex gap-3 pt-1">
            <span className="text-[#00ff62] text-xs font-bold font-mono">⚡ {pts} Skill Points</span>
            <span className="text-violet-400 text-xs font-bold font-mono">🤝 {user?.connections?.length || 0} Friends</span>
          </div>
        </div>
      </div>

      <div className="mb-8 p-5 bg-[#141414] border border-white/[0.07] rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-black text-xs uppercase tracking-wider flex items-center gap-2">
            <span>🏆</span> Skill Swap App Awards & Points
          </h3>
          <span className="text-[#00ff62] font-mono text-xs font-bold">Tier: {badge}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-[#00ff62]/10 border border-[#00ff62]/30 rounded-xl text-center shadow-[0_0_15px_rgba(0,255,98,0.1)]">
            <span className="text-xl">⚡</span>
            <p className="text-white text-xs font-bold mt-1">{pts} Points</p>
            <p className="text-[#00ff62] text-[9px] font-mono">+50 per post</p>
          </div>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-center">
            <span className="text-xl">🤝</span>
            <p className="text-white text-xs font-bold mt-1">{user?.connections?.length || 0} Friends</p>
            <p className="text-indigo-400 text-[9px] font-mono">+25 per friend</p>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center">
            <span className="text-xl">🎥</span>
            <p className="text-white text-xs font-bold mt-1">{user?.sessionsCompleted || 0} Sessions</p>
            <p className="text-purple-400 text-[9px] font-mono">+100 per call</p>
          </div>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">
            <span className="text-xl">⭐</span>
            <p className="text-white text-xs font-bold mt-1">{user?.rating || 0} / 5.0</p>
            <p className="text-yellow-400 text-[9px] font-mono">Peer Rating</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2 block">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#141414] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00ff62]/40"
          />
        </div>
        <div>
          <label className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2 block">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell others about yourself..."
            className="w-full bg-[#141414] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00ff62]/40 resize-none placeholder:text-white/20"
          />
        </div>
        <div className="p-4 bg-[#141414] border border-white/[0.07] rounded-2xl space-y-4">
          <SkillListInput
            label="Skills You Offer"
            skills={skillsOffered}
            setSkills={setSkillsOffered}
            color="bg-[#00ff62]/10 text-[#00ff62] border border-[#00ff62]/20"
          />
          <div className="h-px bg-white/[0.05]" />
          <SkillListInput
            label="Skills You Want"
            skills={skillsWanted}
            setSkills={setSkillsWanted}
            color="bg-violet-500/10 text-violet-400 border border-violet-500/20"
          />
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
            saved
              ? 'bg-[#00ff62] text-black'
              : 'bg-[#00ff62]/10 text-[#00ff62] border border-[#00ff62]/20 hover:bg-[#00ff62] hover:text-black'
          } disabled:opacity-50`}
        >
          {saving ? 'Saving...' : saved ? <><FaCheck className="inline-block mr-1" /> Saved!</> : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
