'use client';
import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaPaperPlane, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { getSocket } from '../../lib/socket';
import BorderGlow from '../../components/BorderGlow';

export default function ScheduleMeetModal({ session, user, onClose, onScheduleSubmit }) {
  const now = new Date();
  const nowFormatted = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const [scheduledAt, setScheduledAt] = useState(nowFormatted);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isHelper = session.helper?._id === user?._id;
  const partner = isHelper ? session.requester : session.helper;
  const partnerId = partner?._id || partner;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduledAt) return;
    setIsSubmitting(true);
    try {
      await onScheduleSubmit(session._id, {
        scheduledAt: new Date(scheduledAt).toISOString(),
        meetingStatus: 'requested',
        meetingRequestedBy: user?._id,
        note,
      });

      const socket = getSocket();
      socket.emit('send-session-schedule-notification', {
        recipientId: partnerId,
        sessionData: { ...session, scheduledAt, meetingStatus: 'requested' },
      });

      onClose();
    } catch (err) {
      alert(err.message || 'Failed to request meeting');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[100] flex items-center justify-center p-4 font-sans text-white animate-in fade-in duration-200">
      <BorderGlow
        backgroundColor="#101018"
        borderRadius={32}
        glowColor="143 100 50"
        glowIntensity={1.3}
        colors={['#00ff62', '#3b82f6', '#8b5cf6']}
        className="w-full max-w-md shadow-[0_30px_70px_rgba(0,0,0,0.9)] relative overflow-hidden"
      >
        <div className="p-6 md:p-7 space-y-4 relative z-10">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00ff62]/10 border border-[#00ff62]/30 flex items-center justify-center text-[#00ff62] shadow-[0_0_12px_rgba(0,255,98,0.25)]">
                <FaCalendarAlt className="text-base" />
              </div>
              <div>
                <h3 className="font-black text-base tracking-tight">Schedule Skill Swap Meet</h3>
                <p className="text-xs text-white/40">Propose a meeting time with {partner?.name || 'Partner'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/50 hover:text-white flex items-center justify-center transition-all duration-300 hover:rotate-90 cursor-pointer"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-extrabold text-[#00ff62] uppercase tracking-wider mb-1.5 font-mono flex items-center gap-1.5">
                <FaClock /> Select Date & Time
              </label>
              <input
                type="datetime-local"
                min={nowFormatted}
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-xs text-white outline-none focus:border-[#00ff62] focus:bg-black/60 focus:shadow-[0_0_15px_rgba(0,255,98,0.2)] transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-white/60 uppercase tracking-wider mb-1.5 font-mono">
                Meeting Note / Agenda (Optional)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Let's review React hooks and work through state management exercise."
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#00ff62] focus:bg-black/60 focus:shadow-[0_0_15px_rgba(0,255,98,0.2)] transition-all font-sans leading-relaxed resize-none"
              />
            </div>

            <div className="p-3.5 bg-black/40 border border-white/[0.08] rounded-2xl text-xs text-white/60 space-y-1">
              <p className="font-extrabold text-[#00ff62] font-mono flex items-center gap-1.5">
                <FaInfoCircle /> Mutual Agreement Required
              </p>
              <p className="leading-relaxed text-[11px] text-white/50">
                Your requested time will be sent to <strong>{partner?.name || 'Partner'}</strong>. The video meeting room unlocks once they confirm the schedule.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 font-extrabold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#00ff62] to-emerald-400 text-black font-black text-xs uppercase tracking-wider hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,98,0.4)] flex items-center justify-center gap-2"
              >
                <FaPaperPlane /> {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </BorderGlow>
    </div>
  );
}
