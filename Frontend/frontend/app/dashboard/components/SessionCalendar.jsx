'use client';
import React, { useState } from 'react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaVideo,
  FaClock,
  FaComments,
  FaStar,
  FaTimes,
  FaBolt,
  FaCheckCircle,
} from 'react-icons/fa';
import BorderGlow from '../../components/BorderGlow';

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function SessionCalendar({ sessions = [], user, onLaunchMeet, onOpenChat }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Map sessions by date YYYY-MM-DD
  const sessionsByDate = {};
  sessions.forEach((sess) => {
    if (sess.scheduledAt) {
      const d = new Date(sess.scheduledAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!sessionsByDate[key]) sessionsByDate[key] = [];
      sessionsByDate[key].push(sess);
    }
  });

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const selectedDateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const selectedDaySessions = sessionsByDate[selectedDateKey] || [];

  const gridCells = [];

  // Prev month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    gridCells.push({ day, isCurrentMonth: false, key: `prev-${day}` });
  }

  // Current month
  const today = new Date();
  const isTodayMonth = today.getFullYear() === year && today.getMonth() === month;

  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const daySessions = sessionsByDate[dateKey] || [];
    const isToday = isTodayMonth && today.getDate() === d;
    const isSelected =
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === d;

    gridCells.push({
      day: d,
      isCurrentMonth: true,
      isToday,
      isSelected,
      dateKey,
      sessions: daySessions,
      key: `curr-${d}`,
    });
  }

  // Next month padding
  const remainingCells = (7 - (gridCells.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    gridCells.push({ day: d, isCurrentMonth: false, key: `next-${d}` });
  }

  return (
    <BorderGlow
      backgroundColor="#12121a"
      borderRadius={24}
      glowColor="143 100 50"
      glowIntensity={1.2}
      edgeSensitivity={30}
      colors={['#00ff62', '#10b981', '#6366f1']}
      className="p-5 md:p-6 font-sans shadow-2xl"
    >
      <div className="space-y-5 relative">
        {/* Top Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00ff62]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Calendar Compact Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
              <FaCalendarAlt className="text-[#00ff62]" />
              {MONTH_NAMES[month]} <span className="text-[#00ff62] font-mono">{year}</span>
            </h3>
            <p className="text-white/40 text-[11px] font-mono mt-0.5">
              Click any date to inspect scheduled calls
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-[11px] font-bold hover:bg-white/20 transition cursor-pointer border border-white/10"
            >
              Today
            </button>
            <div className="flex items-center bg-black/40 rounded-xl border border-white/10 p-0.5">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 text-white/60 hover:text-white transition cursor-pointer rounded-lg hover:bg-white/10"
                title="Prev Month"
              >
                <FaChevronLeft className="text-[10px]" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 text-white/60 hover:text-white transition cursor-pointer rounded-lg hover:bg-white/10"
                title="Next Month"
              >
                <FaChevronRight className="text-[10px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of Week Header Row */}
        <div className="grid grid-cols-7 text-center">
          {DAYS_SHORT.map((day) => (
            <span key={day} className="text-[10px] font-mono font-extrabold uppercase text-white/30 tracking-wider">
              {day}
            </span>
          ))}
        </div>

        {/* Compact Month Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 bg-[#0a0a0e]/60 p-2 rounded-2xl border border-white/[0.04]">
          {gridCells.map((cell) => {
            const hasSessions = cell.sessions?.length > 0;

            if (!cell.isCurrentMonth) {
              return (
                <div key={cell.key} className="h-10 flex items-center justify-center text-white/15 text-xs font-mono select-none">
                  {cell.day}
                </div>
              );
            }

            return (
              <button
                key={cell.key}
                onClick={() => setSelectedDate(new Date(year, month, cell.day))}
                className={`h-10 rounded-xl flex flex-col items-center justify-center transition-all duration-200 relative cursor-pointer group ${
                  cell.isSelected
                    ? 'bg-[#00ff62] text-black font-black shadow-[0_0_15px_rgba(0,255,98,0.5)] scale-105 z-10'
                    : cell.isToday
                    ? 'bg-white/15 text-[#00ff62] font-black border border-[#00ff62]/50 shadow-[0_0_10px_rgba(0,255,98,0.2)]'
                    : hasSessions
                    ? 'bg-[#00ff62]/10 text-white font-bold border border-[#00ff62]/30 hover:border-[#00ff62]'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-xs font-mono">{cell.day}</span>

                {/* Glowing Dot for Sessions */}
                {hasSessions && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      cell.isSelected ? 'bg-black' : 'bg-[#00ff62] shadow-[0_0_6px_rgba(0,255,98,0.9)] animate-pulse'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Integrated Agenda Panel below Calendar */}
        <div className="pt-3 border-t border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-extrabold text-xs tracking-tight flex items-center gap-1.5">
              <FaClock className="text-[#00ff62]" />
              Agenda for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h4>
            <span className="text-[10px] font-mono text-white/40">
              {selectedDaySessions.length} session(s)
            </span>
          </div>

          {selectedDaySessions.length === 0 ? (
            <div className="bg-black/30 border border-white/[0.04] rounded-2xl p-4 text-center">
              <p className="text-white/30 text-xs font-semibold">No calls scheduled for this date</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {selectedDaySessions.map((s) => {
                const isHelper = s.helper?._id === user?._id || s.helper === user?._id;
                const partner = isHelper ? s.requester : s.helper;
                const partnerName = partner?.name?.split('@')[0] || 'Swap Partner';
                const timeStr = new Date(s.scheduledAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={s._id}
                    className="bg-black/50 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-md hover:border-[#00ff62]/40 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-indigo-600 flex items-center justify-center font-black text-white text-xs flex-shrink-0">
                        {partnerName[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-bold text-xs truncate">{partnerName}</p>
                        <p className="text-white/40 text-[10px] font-mono truncate">{timeStr} • {s.skill}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {partner && (
                        <button
                          onClick={() => onOpenChat && onOpenChat(partner)}
                          className="p-2 rounded-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition cursor-pointer"
                          title="Chat DM"
                        >
                          <FaComments className="text-xs" />
                        </button>
                      )}
                      <button
                        onClick={() => onLaunchMeet && onLaunchMeet(s)}
                        className="px-3 py-1.5 rounded-xl bg-[#00ff62] text-black font-black text-[11px] hover:bg-emerald-400 transition cursor-pointer flex items-center gap-1 shadow-[0_0_10px_rgba(0,255,98,0.3)]"
                      >
                        <FaVideo className="text-[10px]" /> Join Call
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </BorderGlow>
  );
}
