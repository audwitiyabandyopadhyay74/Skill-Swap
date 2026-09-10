'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaCheck, FaLightbulb } from 'react-icons/fa';

export const POPULAR_SKILLS = [
  'React.js',
  'Next.js',
  'JavaScript',
  'TypeScript',
  'Python',
  'Node.js',
  'Tailwind CSS',
  'UI/UX Design',
  'Figma Design',
  'AI & Machine Learning',
  'Data Science',
  'Mobile App Development',
  'Flutter',
  'React Native',
  'Cybersecurity',
  'DevOps & Cloud',
  'Docker & Kubernetes',
  'GraphQL',
  'PostgreSQL',
  'MongoDB',
  'Digital Marketing',
  'SEO Optimization',
  'Copywriting',
  'Audio & Music Production',
  'Video Editing',
  'Motion Graphics',
  '3D Modeling & Blender',
  'Product Management',
  'Agile & Scrum',
  'Public Speaking',
  'English Fluency',
  'Spanish Conversation',
  'Financial Modeling',
  'Solidity & Smart Contracts',
  'System Architecture',
];

export default function SkillInput({
  value = '',
  onChange,
  placeholder = 'e.g. React.js, UI/UX Design, Python',
  className = '',
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = POPULAR_SKILLS.filter((s) =>
    s.toLowerCase().includes((query || '').toLowerCase().trim())
  );

  const handleSelect = (skill) => {
    setQuery(skill);
    onChange(skill);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setIsOpen(true);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          id={id}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#00ff62] transition shadow-inner font-sans ${className}`}
        />
        <FaLightbulb className="absolute right-3 text-amber-400/60 text-xs pointer-events-none" />
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#12121c] border border-[#00ff62]/30 rounded-2xl p-2 shadow-2xl z-50 max-h-56 overflow-y-auto backdrop-blur-xl space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#00ff62] flex items-center gap-1 border-b border-white/5">
            <FaLightbulb className="text-amber-400" /> Skill Suggestions
          </div>
          {filteredSuggestions.map((sk) => {
            const isMatch = (query || '').toLowerCase().trim() === sk.toLowerCase();
            return (
              <button
                key={sk}
                type="button"
                onClick={() => handleSelect(sk)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                  isMatch
                    ? 'bg-[#00ff62] text-black font-extrabold'
                    : 'text-white/80 hover:bg-[#00ff62]/10 hover:text-[#00ff62]'
                }`}
              >
                <span>{sk}</span>
                {isMatch && <FaCheck className="text-xs" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
