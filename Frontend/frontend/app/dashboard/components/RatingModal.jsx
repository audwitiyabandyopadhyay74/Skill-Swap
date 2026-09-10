'use client';
import React, { useState } from 'react';
import { FaStar, FaTimes, FaCheck } from 'react-icons/fa';
import BorderGlow from '../../components/BorderGlow';

export default function RatingModal({ session, user, onClose, onSubmitRating }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRequester = session.requester?._id === user?._id || session.requester === user?._id;
  const partner = isRequester ? session.helper : session.requester;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitRating(session._id, {
        rating,
        review,
        ratedBy: user?._id,
      });
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to submit rating');
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
        colors={['#00ff62', '#f59e0b', '#8b5cf6']}
        className="w-full max-w-md shadow-[0_30px_70px_rgba(0,0,0,0.9)] relative overflow-hidden"
      >
        <div className="p-6 md:p-7 space-y-5 relative z-10">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
            <div>
              <h3 className="font-black text-base tracking-tight">Rate Skill Swap Partner</h3>
              <p className="text-xs text-white/40 leading-relaxed mt-0.5">
                How was your session with <strong className="text-[#00ff62] font-extrabold">{partner?.name || 'Partner'}</strong>?
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/50 hover:text-white flex items-center justify-center transition-all duration-300 hover:rotate-90 cursor-pointer"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Interactive Star Rating Picker */}
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1.5 transition-all transform hover:scale-125 cursor-pointer text-2xl"
                  >
                    <FaStar
                      className={
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.7)]'
                          : 'text-white/20'
                      }
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                {rating === 5 ? '⭐⭐⭐⭐⭐ Excellent Swap!' : `${rating} out of 5 stars`}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-white/60 uppercase tracking-wider mb-1.5 font-mono">
                Review / Feedback (Optional)
              </label>
              <textarea
                rows={3}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="e.g. Great session! Very knowledgeable and patient explanations."
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#00ff62] focus:bg-black/60 focus:shadow-[0_0_15px_rgba(0,255,98,0.2)] transition-all font-sans leading-relaxed resize-none"
              />
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
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#00ff62] to-emerald-400 text-black font-black text-xs uppercase tracking-wider hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,98,0.4)] flex items-center justify-center gap-1.5"
              >
                <FaCheck /> {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </form>
        </div>
      </BorderGlow>
    </div>
  );
}
