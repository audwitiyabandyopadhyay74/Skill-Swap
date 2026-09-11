'use client';
import React, { useState, useEffect, useRef } from 'react';
import { postsAPI, usersAPI } from '../../lib/api';
import gsap from 'gsap';
import {
  FaLightbulb,
  FaBullseye,
  FaCheck,
  FaTimes,
  FaClipboardList,
  FaUser,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaShareAlt,
  FaUserPlus,
  FaUserCheck,
  FaComment,
  FaPaperPlane,
  FaComments,
  FaFire,
  FaSearch,
  FaGlobe,
  FaExchangeAlt,
  FaStar,
  FaBolt,
  FaCode,
  FaPaintBrush,
  FaChartLine,
  FaRobot,
  FaMusic,
  FaArrowRight,
  FaUserFriends,
  FaMagic,
} from 'react-icons/fa';
import BorderGlow from '../../components/BorderGlow';

const CATEGORIES = [
  { id: 'all', label: 'All Swaps', icon: FaGlobe },
  { id: 'friends', label: "Friends' Swaps", icon: FaUserFriends },
  { id: 'code', label: 'Code & Dev', icon: FaCode },
  { id: 'design', label: 'Design & UI', icon: FaPaintBrush },
  { id: 'ai', label: 'AI & Data', icon: FaRobot },
  { id: 'business', label: 'Marketing & Biz', icon: FaChartLine },
  { id: 'audio', label: 'Audio & Music', icon: FaMusic },
];


const isCleanSkill = (s) => {
  if (!s || typeof s !== 'string') return false;
  const trimmed = s.trim();
  if (trimmed.length < 2) return false;
  if (/^[a-z0-9]+$/i.test(trimmed) && trimmed.length < 3 && !['ui', 'ux', 'ai', 'ml', 'js', 'ts', 'py'].includes(trimmed.toLowerCase())) {
    return false;
  }
  return true;
};


const calculateMatchScore = (user, post) => {
  if (!user || !post) return 88;
  const wanted = user.skillsWanted || [];
  const offered = user.skillsOffered || [];
  const postOffering = post.offering ? [post.offering] : (post.skillsOffered || [post.skillOffered]);
  const postSeeking = post.seeking ? [post.seeking] : (post.skillsWanted || [post.skillWanted]);

  let score = 78;
  if (postOffering?.some((s) => s && wanted.some((w) => w.toLowerCase().includes(s.toLowerCase())))) score += 14;
  if (postSeeking?.some((s) => s && offered.some((o) => o.toLowerCase().includes(s.toLowerCase())))) score += 7;
  return Math.min(99, score);
};

const PostCard = ({ post, user, onSendProposal, onOpenChat, onRefresh }) => {
  const cardRef = useRef(null);
  const isAuthor = post.author?._id === user?._id;
  const hasProposed = post.proposals?.some((p) => p.user?._id === user?._id || p.user === user?._id);

  const authorName = post.author?.name
    ? (post.author.name.includes('@') ? post.author.name.split('@')[0] : post.author.name)
    : 'Swap Partner';

  const matchScore = calculateMatchScore(user, post);

  const isLikedByMe = post.likes?.some((id) => id === user?._id || id?._id === user?._id);
  const isBookmarkedByMe = post.bookmarks?.some((id) => id === user?._id || id?._id === user?._id);
  const isFollowingAuthor = user?.connections?.some((id) => id === post.author?._id || id?._id === post.author?._id);

  const [liked, setLiked] = useState(isLikedByMe);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [bookmarked, setBookmarked] = useState(isBookmarkedByMe);
  const [following, setFollowing] = useState(isFollowingAuthor);
  const [shareNotice, setShareNotice] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    setLiked(post.likes?.some((id) => id === user?._id || id?._id === user?._id));
    setLikeCount(post.likes?.length || 0);
    setBookmarked(post.bookmarks?.some((id) => id === user?._id || id?._id === user?._id));
    setFollowing(user?.connections?.some((id) => id === post.author?._id || id?._id === post.author?._id));
    setComments(post.comments || []);
  }, [post, user]);

  const toggleLike = async () => {
    try {
      const prevLiked = liked;
      setLiked(!prevLiked);
      setLikeCount((prev) => (prevLiked ? prev - 1 : prev + 1));
      await postsAPI.toggleLike(post._id);
    } catch (err) {
      console.log('Like notice:', err.message);
    }
  };

  const toggleBookmark = async () => {
    try {
      setBookmarked(!bookmarked);
      await postsAPI.toggleBookmark(post._id);
    } catch (err) {
      console.log('Bookmark notice:', err.message);
    }
  };

  const toggleFollow = async () => {
    if (!post.author?._id) return;
    try {
      setFollowing(!following);
      await usersAPI.toggleFollow(post.author._id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.log('Follow notice:', err.message);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareNotice(true);
    setTimeout(() => setShareNotice(false), 2000);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const data = await postsAPI.addComment(post._id, commentText.trim());
      setComments(data.post?.comments || []);
      setCommentText('');
    } catch (err) {
      console.log('Comment notice:', err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div ref={cardRef}>
      <BorderGlow
        backgroundColor="#12121c"
        borderRadius={28}
        glowColor="143 100 50"
        glowIntensity={1.2}
        edgeSensitivity={30}
        colors={['#00ff62', '#3b82f6', '#8b5cf6']}
        className="p-6 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.4)] relative group overflow-hidden"
      >
        {/* Background Ambient Glow Accent */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#00ff62]/10 via-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:bg-[#00ff62]/20 transition duration-500" />

        {/* Share Toast */}
        {shareNotice && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-[#00ff62] text-black font-extrabold text-[10px] px-3.5 py-1 rounded-full shadow-[0_0_15px_rgba(0,255,98,0.6)] font-mono flex items-center gap-1.5 animate-bounce">
            <FaCheck /> Link copied!
          </div>
        )}

        <div className="space-y-4">
          {/* Author Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-indigo-500 to-purple-600 p-[2px] shadow-[0_0_15px_rgba(0,255,98,0.25)] flex-shrink-0 group-hover:scale-105 transition duration-300">
                  <div className="w-full h-full rounded-[14px] bg-[#121214] flex items-center justify-center font-black text-white text-sm">
                    {authorName?.[0]?.toUpperCase() || '?'}
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#00ff62] border-2 border-[#121214] rounded-full shadow-[0_0_8px_rgba(0,255,98,0.8)]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-black text-base md:text-lg leading-snug group-hover:text-[#00ff62] transition truncate tracking-tight">
                    {post.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/40 text-xs font-medium truncate">by {authorName}</span>
                  {!isAuthor && (
                    <button
                      onClick={toggleFollow}
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full transition flex items-center gap-1 cursor-pointer ${
                        following
                          ? 'bg-white/10 text-white/80 border border-white/20'
                          : 'bg-[#00ff62]/10 text-[#00ff62] border border-[#00ff62]/30 hover:bg-[#00ff62] hover:text-black shadow-[0_0_10px_rgba(0,255,98,0.15)]'
                      }`}
                    >
                      {following ? <><FaUserCheck /> Connected</> : <><FaUserPlus /> Connect</>}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-[10px] bg-gradient-to-r from-[#00ff62]/20 to-emerald-500/20 text-[#00ff62] border border-[#00ff62]/40 px-2.5 py-1 rounded-full font-mono font-extrabold flex items-center gap-1 shadow-[0_0_12px_rgba(0,255,98,0.2)]">
                <FaFire className="text-amber-400 animate-pulse" /> {matchScore}% Match
              </span>
            </div>
          </div>

          {/* Description */}
          {post.description && (
            <p className="text-white/70 text-xs leading-relaxed line-clamp-3 bg-black/40 p-3.5 rounded-2xl border border-white/[0.05]">
              {post.description}
            </p>
          )}

          {/* Visual Skill Exchange Connector */}
          <div className="bg-gradient-to-r from-black/70 via-[#161622] to-black/70 p-4 rounded-2xl border border-white/[0.08] flex items-center justify-between gap-3 shadow-inner">
            <div className="flex-1 min-w-0 space-y-1">
              <span className="text-white/40 text-[9px] font-mono font-black uppercase tracking-wider flex items-center gap-1">
                <FaLightbulb className="text-[#00ff62]" /> Offering Skill
              </span>
              <div className="text-[#00ff62] font-black text-xs md:text-sm bg-[#00ff62]/10 border border-[#00ff62]/30 px-3 py-1.5 rounded-xl truncate shadow-[0_0_10px_rgba(0,255,98,0.1)]">
                {post.skillOffered}
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#00ff62]/10 border border-[#00ff62]/30 flex items-center justify-center text-[#00ff62] flex-shrink-0 shadow-[0_0_12px_rgba(0,255,98,0.3)]">
              <FaArrowRight className="text-xs" />
            </div>

            <div className="flex-1 min-w-0 space-y-1 text-right">
              <span className="text-white/40 text-[9px] font-mono font-black uppercase tracking-wider flex items-center gap-1 justify-end">
                <FaBullseye className="text-indigo-400" /> Seeking Skill
              </span>
              <div className="text-indigo-300 font-black text-xs md:text-sm bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl truncate shadow-[0_0_10px_rgba(99,102,241,0.15)] inline-block w-full">
                {post.skillWanted}
              </div>
            </div>
          </div>

          {/* Social Interaction Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLike}
                className={`flex items-center gap-1.5 text-xs font-mono font-extrabold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  liked
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                    : 'text-white/50 hover:text-rose-400 hover:bg-white/5 border border-transparent'
                }`}
              >
                {liked ? <FaHeart className="text-rose-400 animate-bounce" /> : <FaRegHeart />}
                <span>{likeCount}</span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className={`flex items-center gap-1.5 text-xs font-mono font-extrabold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  showComments
                    ? 'bg-[#00ff62]/20 text-[#00ff62] border border-[#00ff62]/40'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <FaComment />
                <span>{comments.length}</span>
              </button>

              <button
                onClick={toggleBookmark}
                className={`flex items-center gap-1.5 text-xs font-mono font-extrabold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  bookmarked
                    ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40'
                    : 'text-white/50 hover:text-amber-400 hover:bg-white/5 border border-transparent'
                }`}
              >
                {bookmarked ? <FaBookmark className="text-amber-400" /> : <FaRegBookmark />}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs font-mono font-extrabold px-2.5 py-1.5 rounded-xl text-white/50 hover:text-[#00ff62] hover:bg-white/5 transition cursor-pointer"
              >
                <FaShareAlt />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {!isAuthor && post.author && (
                <button
                  onClick={() => onOpenChat && onOpenChat(post.author)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 text-white font-extrabold text-xs hover:bg-[#00ff62] hover:text-black transition cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <FaComments className="text-sm" /> Message
                </button>
              )}

              {isAuthor ? (
                <span className="text-xs text-white/30 italic font-mono px-2 py-1">Your Post</span>
              ) : hasProposed ? (
                <span className="text-xs text-emerald-400 font-extrabold bg-emerald-400/10 px-3.5 py-2 rounded-xl border border-emerald-400/30 flex items-center gap-1.5">
                  <FaCheck /> Proposal Sent
                </span>
              ) : (
                <button
                  onClick={() => onSendProposal(post)}
                  className="px-4 py-2 rounded-xl bg-[#00ff62] text-black font-black text-xs hover:bg-emerald-400 transition cursor-pointer shadow-[0_0_20px_rgba(0,255,98,0.4)] flex items-center gap-1.5"
                >
                  <FaClipboardList /> Send Proposal
                </button>
              )}
            </div>
          </div>

          {/* Comment Discussion Drawer */}
          {showComments && (
            <div className="mt-2 pt-3 border-t border-white/10 space-y-3">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment to this swap post..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#00ff62]/50 placeholder:text-white/20 font-sans"
                />
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="px-3.5 py-2 rounded-xl bg-[#00ff62] text-black font-extrabold text-xs hover:bg-emerald-400 transition cursor-pointer disabled:opacity-50 shadow-[0_0_12px_rgba(0,255,98,0.3)]"
                >
                  <FaPaperPlane />
                </button>
              </form>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {comments.length === 0 ? (
                  <p className="text-white/30 text-[11px] italic text-center py-2 font-mono">No comments yet. Start the conversation!</p>
                ) : (
                  comments.map((c, i) => (
                    <div key={c._id || i} className="bg-black/40 p-3 rounded-xl border border-white/5 text-xs space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-[#00ff62] font-mono font-extrabold">
                        <span>{c.userName}</span>
                        <span className="text-white/20">{c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      </div>
                      <p className="text-white/80 leading-snug">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </BorderGlow>
    </div>
  );
};

const ProposalModal = ({ post, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please write a message for your proposal.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await postsAPI.createProposal(post._id, message);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit proposal.');
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
        glowIntensity={1.3}
        colors={['#00ff62', '#10b981', '#6366f1']}
        className="w-full max-w-md shadow-[0_30px_70px_rgba(0,0,0,0.9)] relative overflow-hidden"
      >
        <div className="p-6 space-y-4 relative z-10">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-2xl bg-[#00ff62]/10 border border-[#00ff62]/30 flex items-center justify-center text-[#00ff62] shadow-[0_0_12px_rgba(0,255,98,0.2)]">
                <FaClipboardList className="text-base" />
              </span>
              <div>
                <h3 className="text-white font-black text-base">Send Skill Swap Proposal</h3>
                <p className="text-white/40 text-xs">Connect directly to agree on a swap</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/50 hover:text-white flex items-center justify-center transition-all duration-300 hover:rotate-90 cursor-pointer"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>

          <div className="bg-black/40 p-3 rounded-2xl border border-white/5 text-xs text-white/60">
            Replying to <strong className="text-[#00ff62] font-extrabold">{post.author?.name}</strong>&apos;s swap request:
            <span className="block text-white font-semibold italic mt-0.5 truncate">&quot;{post.title}&quot;</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/60 text-[11px] font-mono font-extrabold uppercase tracking-wider block mb-1.5">
                Your Proposal Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Introduce yourself and explain how your skills can help them..."
                rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs outline-none focus:border-[#00ff62] focus:bg-black/60 focus:shadow-[0_0_15px_rgba(0,255,98,0.2)] placeholder:text-white/20 resize-none font-sans leading-relaxed transition-all"
              />
            </div>

            {error && (
              <p className="text-rose-400 text-xs font-mono bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                {error}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 font-extrabold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#00ff62] to-emerald-400 text-black font-black text-xs uppercase tracking-wider hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,98,0.4)]"
              >
                {loading ? 'Sending...' : 'Submit Proposal'}
              </button>
            </div>
          </form>
        </div>
      </BorderGlow>
    </div>
  );
};

import AIRoadmapModal from './AIRoadmapModal';

export default function DashboardBrowse({ user, onCreatePost, onRefresh, onOpenChat }) {
  const [subTab, setSubTab] = useState('posts');
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [allPosts, setAllPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proposalPost, setProposalPost] = useState(null);
  const [showAiRoadmap, setShowAiRoadmap] = useState(false);
  const [aiRoadmapSkill, setAiRoadmapSkill] = useState('');


  const fetchData = async (q = '') => {
    setLoading(true);
    try {
      if (subTab === 'posts') {
        const data = await postsAPI.list(q ? { search: q } : {});
        setPosts(data.posts || []);
        if (!q) setAllPosts(data.posts || []);
      } else {
        const data = await usersAPI.browse(q ? { search: q } : {});
        setUsers(data.users || []);
        if (!q) setAllUsers(data.users || []);
      }
    } catch (err) {
      console.log('Fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [postsRes, usersRes] = await Promise.all([
          postsAPI.list({}),
          usersAPI.browse({})
        ]);
        if (postsRes.posts) setAllPosts(postsRes.posts);
        if (usersRes.users) setAllUsers(usersRes.users);
      } catch (err) {
        console.log('Initial fetch notice:', err.message);
      }
    };
    fetchInitialData();
  }, []);

const CANONICAL_SKILL_MAP = {
  react: 'React.js',
  reactjs: 'React.js',
  'react.js': 'React.js',
  python: 'Python',
  py: 'Python',
  python3: 'Python',
  ui: 'UI/UX Design',
  ux: 'UI/UX Design',
  'ui/ux': 'UI/UX Design',
  'ui ux': 'UI/UX Design',
  figma: 'UI/UX Design',
  design: 'UI/UX Design',
  ai: 'AI & Data',
  ml: 'AI & Data',
  'machine learning': 'AI & Data',
  chatgpt: 'AI & Data',
  data: 'AI & Data',
  node: 'Node.js',
  nodejs: 'Node.js',
  'node.js': 'Node.js',
  express: 'Node.js',
  next: 'Next.js',
  nextjs: 'Next.js',
  'next.js': 'Next.js',
  tailwind: 'Tailwind CSS',
  tailwindcss: 'Tailwind CSS',
  css: 'Tailwind CSS',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  js: 'JavaScript',
  javascript: 'JavaScript',
  web: 'Web Dev',
  webdev: 'Web Dev',
  'web development': 'Web Dev',
  marketing: 'Digital Marketing',
  seo: 'Digital Marketing',
  music: 'Audio Production',
  audio: 'Audio Production'
};

const normalizeSkill = (s) => {
  if (!isCleanSkill(s)) return null;
  const lower = s.trim().toLowerCase();
  if (CANONICAL_SKILL_MAP[lower]) return CANONICAL_SKILL_MAP[lower];
  return s.trim().split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

  const dynamicTrendingSkills = React.useMemo(() => {
    const frequencyMap = {};

    allPosts.forEach((p) => {
      if (p.skillOffered) {
        const norm = normalizeSkill(p.skillOffered);
        if (norm) frequencyMap[norm] = (frequencyMap[norm] || 0) + 3;
      }
      if (p.skillWanted) {
        const norm = normalizeSkill(p.skillWanted);
        if (norm) frequencyMap[norm] = (frequencyMap[norm] || 0) + 2;
      }
    });

    allUsers.forEach((u) => {
      [...(u.skillsOffered || []), ...(u.skillsWanted || [])].forEach((rawSkill) => {
        const norm = normalizeSkill(rawSkill);
        if (norm) frequencyMap[norm] = (frequencyMap[norm] || 0) + 1;
      });
    });

    const sortedNames = Object.keys(frequencyMap).sort((a, b) => frequencyMap[b] - frequencyMap[a]);

    return sortedNames.slice(0, 8).map((name) => ({
      name,
      count: frequencyMap[name] || 1
    }));
  }, [allPosts, allUsers]);


  useEffect(() => {
    fetchData(search);
  }, [subTab]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    const t = setTimeout(() => fetchData(val), 300);
    return () => clearTimeout(t);
  };

  const handleToggleFollowUser = async (uId) => {
    try {
      await usersAPI.toggleFollow(uId);
      fetchData(search);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.log('Follow notice:', err.message);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'friends') {
      const friendIds = user?.connections?.map((c) => (typeof c === 'object' ? c._id : c)) || [];
      return friendIds.includes(p.author?._id);
    }
    const cat = activeCategory.toLowerCase();
    const text = `${p.title} ${p.skillOffered} ${p.skillWanted} ${p.description || ''}`.toLowerCase();
    if (cat === 'code') return text.includes('code') || text.includes('react') || text.includes('python') || text.includes('js') || text.includes('dev') || text.includes('web');
    if (cat === 'design') return text.includes('design') || text.includes('ui') || text.includes('ux') || text.includes('logo') || text.includes('figma');
    if (cat === 'ai') return text.includes('ai') || text.includes('data') || text.includes('ml') || text.includes('gpt');
    if (cat === 'business') return text.includes('market') || text.includes('seo') || text.includes('biz') || text.includes('sales');
    if (cat === 'audio') return text.includes('music') || text.includes('audio') || text.includes('sound') || text.includes('video');
    return true;
  });


  return (
    <div className="p-4 md:p-8 space-y-6 font-sans max-w-7xl mx-auto pb-36 md:pb-8">
      {/* Luxury Hero Header Banner */}
      <BorderGlow
        backgroundColor="#12121c"
        borderRadius={28}
        glowColor="143 100 50"
        glowIntensity={1.2}
        colors={['#00ff62', '#10b981', '#6366f1']}
        className="p-6 md:p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#00ff62]/15 text-[#00ff62] border border-[#00ff62]/30 text-[10px] font-mono font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,255,98,0.2)]">
                <FaStar className="animate-spin text-amber-400" /> Live Peer Exchange Network
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Skill Exchange Feed
            </h1>
            <p className="text-white/50 text-xs md:text-sm max-w-xl leading-relaxed">
              Discover posts from verified members looking to exchange skills, schedule mutual learning sessions, or connect directly.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => setShowAiRoadmap(true)}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-[#00ff62] text-black font-black text-xs md:text-sm hover:opacity-90 transition cursor-pointer shadow-[0_0_25px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 hover:scale-105"
            >
              <FaMagic className="text-sm" /> ✨ Gemini AI Roadmap
            </button>

            <button
              onClick={onCreatePost}
              className="px-6 py-3.5 rounded-2xl bg-[#00ff62] text-black font-black text-xs md:text-sm hover:bg-emerald-400 transition cursor-pointer shadow-[0_0_25px_rgba(0,255,98,0.4)] flex items-center justify-center gap-2 hover:scale-105"
            >
              <span className="text-lg leading-none">+</span> Post Skill Exchange
            </button>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-white/70">
            <span className="w-2 h-2 rounded-full bg-[#00ff62] animate-ping" />
            <span><strong className="text-white font-bold">{posts.length}</strong> Open Swaps</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <FaFire className="text-[#00ff62]" />
            <span><strong className="text-white font-bold">98.4%</strong> Match Rate</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <FaBolt className="text-indigo-400" />
            <span><strong className="text-white font-bold">Real-Time</strong> Socket Sync</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <FaComments className="text-purple-400" />
            <span><strong className="text-white font-bold">Direct</strong> DM Enabled</span>
          </div>
        </div>
      </BorderGlow>

      {/* Navigation Subtabs & Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex bg-[#0a0a0f] p-1.5 rounded-2xl border border-white/10 self-start shadow-inner">
          <button
            onClick={() => setSubTab('posts')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
              subTab === 'posts'
                ? 'bg-[#00ff62] text-black shadow-[0_0_15px_rgba(0,255,98,0.35)]'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <FaClipboardList className="inline-block mr-1.5 text-sm" /> Exchange Posts
          </button>
          <button
            onClick={() => setSubTab('users')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
              subTab === 'users'
                ? 'bg-[#00ff62] text-black shadow-[0_0_15px_rgba(0,255,98,0.35)]'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <FaUser className="inline-block mr-1.5 text-sm" /> Member Directory
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xs" />
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder={subTab === 'posts' ? 'Search by skill or topic...' : 'Search by member name or skill...'}
            className="w-full bg-[#12121a] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white text-xs outline-none focus:border-[#00ff62] placeholder:text-white/20 font-sans shadow-inner"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      {subTab === 'posts' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const IconComp = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-[#00ff62]/15 text-[#00ff62] border-[#00ff62]/40 shadow-[0_0_12px_rgba(0,255,98,0.2)]'
                    : 'bg-[#12121a]/80 text-white/50 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <IconComp className={isActive ? 'text-[#00ff62]' : 'text-white/40'} />
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content View: Posts (2-Column) vs Members (Full 3-Column Grid) */}
      {subTab === 'users' ? (
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#12121c] border border-white/[0.06] rounded-3xl h-64 animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 bg-[#12121c]/80 border border-white/[0.08] rounded-3xl p-8 space-y-3 shadow-xl">
              <FaUser className="text-4xl text-white/20 mx-auto mb-2" />
              <p className="text-white/60 text-base font-bold">No members found matching your search</p>
              <p className="text-white/30 text-xs">Try searching for a different skill or member name.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((u) => {
                const isFollowing = user?.connections?.some((id) => id === u._id || id?._id === u._id);
                const cleanUName = u.name ? (u.name.includes('@') ? u.name.split('@')[0] : u.name) : 'Member';
                const validSkillsOffered = (u.skillsOffered || []).filter(isCleanSkill);
                const validSkillsWanted = (u.skillsWanted || []).filter(isCleanSkill);

                return (
                  <BorderGlow
                    key={u._id}
                    backgroundColor="#12121c"
                    borderRadius={28}
                    glowColor="143 100 50"
                    glowIntensity={1.2}
                    colors={['#00ff62', '#6366f1', '#ec4899']}
                    className="p-6 shadow-xl flex flex-col justify-between h-full group transition-all duration-300 hover:scale-[1.01]"
                  >
                    <div className="space-y-4">
                      {/* Avatar Header & Match Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 via-indigo-500 to-purple-600 p-[2px] shadow-[0_0_15px_rgba(0,255,98,0.2)] flex-shrink-0">
                              <div className="w-full h-full rounded-[14px] bg-[#121214] flex items-center justify-center font-black text-white text-base">
                                {cleanUName[0]?.toUpperCase()}
                              </div>
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00ff62] border-2 border-[#121214] rounded-full shadow-[0_0_8px_rgba(0,255,98,0.8)]" />
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-white font-black text-base truncate group-hover:text-[#00ff62] transition">{cleanUName}</h4>
                            <p className="text-white/30 text-xs font-mono truncate">{u.email}</p>
                          </div>
                        </div>

                        <span className="text-[10px] bg-[#00ff62]/15 text-[#00ff62] border border-[#00ff62]/30 px-2.5 py-1 rounded-full font-mono font-extrabold flex items-center gap-1 shadow-[0_0_10px_rgba(0,255,98,0.2)] flex-shrink-0">
                          <FaStar className="text-amber-400" /> 98% Match
                        </span>
                      </div>

                      {/* Bio Section */}
                      <p className="text-white/70 text-xs leading-relaxed line-clamp-2 bg-black/40 p-3 rounded-2xl border border-white/[0.05]">
                        {u.bio || 'Verified member actively sharing expertise on SkillSwap.'}
                      </p>

                      {/* Skills Offered (Emerald) */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] text-white/40 uppercase font-mono font-black flex items-center gap-1">
                          <FaLightbulb className="text-[#00ff62]" /> Skills Offered
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {validSkillsOffered.length > 0 ? (
                            validSkillsOffered.map((s, sIdx) => (
                              <span
                                key={`offered-${s}-${sIdx}`}
                                className="px-2.5 py-1 rounded-xl bg-[#00ff62]/10 text-[#00ff62] border border-[#00ff62]/25 text-[10px] font-mono font-black shadow-[0_0_8px_rgba(0,255,98,0.1)]"
                              >
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-white/30 text-xs italic font-mono">Full Stack & Design</span>
                          )}
                        </div>
                      </div>

                      {/* Skills Wanted (Indigo) */}
                      {validSkillsWanted.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-white/40 uppercase font-mono font-black flex items-center gap-1">
                            <FaBullseye className="text-indigo-400" /> Skills Seeking
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {validSkillsWanted.map((s, sIdx) => (
                              <span
                                key={`wanted-${s}-${sIdx}`}
                                className="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 text-[10px] font-mono font-black"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleFollowUser(u._id)}
                        className={`text-[10px] font-extrabold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                          isFollowing
                            ? 'bg-white/10 text-white/80 border border-white/20'
                            : 'bg-[#00ff62]/10 text-[#00ff62] border border-[#00ff62]/30 hover:bg-[#00ff62] hover:text-black shadow-[0_0_10px_rgba(0,255,98,0.15)]'
                        }`}
                      >
                        {isFollowing ? <><FaUserCheck /> Friends</> : <><FaUserPlus /> Make a Friend</>}

                      </button>

                      <button
                        onClick={() => onOpenChat && onOpenChat(u)}
                        className="px-4 py-2 rounded-xl bg-[#00ff62] text-black font-black text-xs hover:bg-emerald-400 transition cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,98,0.3)]"
                      >
                        <FaComments /> Message Member
                      </button>
                    </div>
                  </BorderGlow>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* 2-Column Split System: Feed Cards (Left) vs Trending Sidebar (Right) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8/12 width): Post Feed */}
          <div className="lg:col-span-8 space-y-5">
            {loading ? (
              <div className="space-y-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-[#12121c] border border-white/[0.06] rounded-3xl h-64 animate-pulse" />
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20 bg-[#12121c]/80 border border-white/[0.08] rounded-3xl p-8 space-y-3 shadow-xl">
                <FaExchangeAlt className="text-4xl text-white/20 mx-auto mb-2" />
                <p className="text-white/60 text-base font-bold">No skill exchange posts match your criteria</p>
                <p className="text-white/30 text-xs">Try selecting another category or creating a post!</p>
                <button
                  onClick={onCreatePost}
                  className="mt-4 px-5 py-2.5 bg-[#00ff62] text-black rounded-xl text-xs font-black hover:bg-emerald-400 transition cursor-pointer shadow-[0_0_15px_rgba(0,255,98,0.3)]"
                >
                  + Create Post
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredPosts.map((p) => (
                  <PostCard
                    key={p._id}
                    post={p}
                    user={user}
                    onSendProposal={(post) => setProposalPost(post)}
                    onOpenChat={onOpenChat}
                    onRefresh={fetchData}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column (4/12 width): Sticky Trending Skills & Guidelines Sidebar */}
          <div className="lg:col-span-4 space-y-5 sticky top-6">
            {/* Trending Skills Widget */}
            <BorderGlow
              backgroundColor="#12121c"
              borderRadius={24}
              glowColor="143 100 50"
              glowIntensity={1.1}
              colors={['#00ff62', '#10b981', '#6366f1']}
              className="p-5 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FaFire className="text-amber-400 animate-pulse" /> Trending Skills
                  </h3>
                  <div className="flex items-center gap-2">
                    {search && (
                      <button
                        onClick={() => {
                          setSearch('');
                          fetchData('');
                        }}
                        className="text-[10px] font-mono text-rose-400 hover:underline font-bold cursor-pointer"
                      >
                        Clear Filter ✕
                      </button>
                    )}
                    <span className="text-[10px] font-mono text-[#00ff62] font-bold">Live Demand</span>
                  </div>
                </div>
                <p className="text-white/40 text-[11px]">
                  Click any tag to instantly filter peer exchange posts by skill.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {dynamicTrendingSkills.length === 0 ? (
                    <p className="text-white/30 text-[11px] font-mono italic">
                      Skills will appear here once members start posting.
                    </p>
                  ) : (
                    dynamicTrendingSkills.map((sk, skIdx) => {
                      const isActive = search.toLowerCase() === sk.name.toLowerCase();
                      return (
                        <button
                          key={`trend-${sk.name}-${skIdx}`}
                          onClick={() => {
                            if (isActive) {
                              setSearch('');
                              fetchData('');
                            } else {
                              setSearch(sk.name);
                              fetchData(sk.name);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold transition cursor-pointer flex items-center gap-1.5 border ${
                            isActive
                              ? 'bg-[#00ff62] text-black border-[#00ff62] shadow-[0_0_15px_rgba(0,255,98,0.4)] scale-105'
                              : 'bg-[#00ff62]/10 hover:bg-[#00ff62]/20 text-[#00ff62] border-[#00ff62]/30 hover:border-[#00ff62]/60 shadow-[0_0_10px_rgba(0,255,98,0.1)]'
                          }`}
                        >
                          <span>#{sk.name}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-sans ${
                              isActive ? 'bg-black/30 text-black font-extrabold' : 'bg-[#00ff62]/20 text-[#00ff62]'
                            }`}
                          >
                            {sk.count}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

            </BorderGlow>

            {/* Quick Swap Rules Card */}
            <BorderGlow
              backgroundColor="#12121c"
              borderRadius={24}
              glowColor="250 80 50"
              glowIntensity={1.0}
              colors={['#3b82f6', '#00ff62', '#8b5cf6']}
              className="p-5 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#00ff62]">
                  <FaStar className="text-sm text-amber-400" />
                  <h3 className="text-white font-black text-xs uppercase tracking-wider">
                    How Skill Swaps Work
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-white/70 font-sans leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#00ff62]/20 text-[#00ff62] font-mono font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <p>Browse posts or publish your own skill offer.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#00ff62]/20 text-[#00ff62] font-mono font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <p>Submit a proposal to initiate a peer agreement.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#00ff62]/20 text-[#00ff62] font-mono font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <p>Schedule a live video call & start learning!</p>
                  </div>
                </div>
              </div>
            </BorderGlow>
          </div>
        </div>
      )}

      {proposalPost && (
        <ProposalModal
          post={proposalPost}
          onClose={() => setProposalPost(null)}
          onSuccess={() => fetchData(search)}
        />
      )}

      {showAiRoadmap && (
        <AIRoadmapModal
          initialSkill={aiRoadmapSkill}
          onClose={() => {
            setShowAiRoadmap(false);
            setAiRoadmapSkill('');
          }}
        />
      )}
    </div>
  );
}

