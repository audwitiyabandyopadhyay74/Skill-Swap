import Post from '../models/Post.js';
import Session from '../models/Session.js';
import { memoryDB } from '../dbStore.js';
import mongoose from 'mongoose';

const isDBConnected = () => mongoose.connection.readyState === 1;

export const getPosts = async (req, res) => {
  try {
    const { search, skillOffered, skillWanted } = req.query;

    if (isDBConnected()) {
      const query = { status: 'open' };
      if (search) {
        query.$or = [
          { title: new RegExp(search, 'i') },
          { skillOffered: new RegExp(search, 'i') },
          { skillWanted: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
        ];
      }
      if (skillOffered) query.skillOffered = new RegExp(skillOffered, 'i');
      if (skillWanted) query.skillWanted = new RegExp(skillWanted, 'i');

      const posts = await Post.find(query)
        .populate('author', 'name email avatar skillsOffered skillsWanted rating')
        .populate('proposals.user', 'name email avatar rating')
        .sort({ createdAt: -1 });

      return res.json({ posts });
    } else {
      const posts = memoryDB.getPosts({ search });
      return res.json({ posts });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, skillOffered, skillWanted, description } = req.body;
    if (!title || !skillOffered || !skillWanted) {
      return res.status(400).json({ message: 'Title, skill offered, and skill wanted are required' });
    }

    if (isDBConnected()) {
      const post = await Post.create({
        author: req.user._id,
        title,
        skillOffered,
        skillWanted,
        description: description || '',
      });
      // Award +50 Skill Swap Points for creating a post
      const user = await User.findById(req.user._id);
      if (user) {
        user.points = (user.points || 100) + 50;
        await user.save();
      }
      await post.populate('author', 'name email avatar rating');
      return res.status(201).json({ post });
    } else {
      const post = memoryDB.createPost(req.user._id, {
        title,
        skillOffered,
        skillWanted,
        description,
      });
      const user = memoryDB.findUserById(req.user._id);
      if (user) {
        user.points = (user.points || 100) + 50;
      }
      return res.status(201).json({ post });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const sendProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Proposal message is required' });

    if (isDBConnected()) {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      if (post.author.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot send a proposal on your own post' });
      }

      post.proposals.push({ user: req.user._id, message, status: 'pending' });
      await post.save();
      await post.populate('proposals.user', 'name email avatar rating');
      return res.json({ post });
    } else {
      const post = memoryDB.addProposal(id, req.user._id, message);
      return res.json({ post });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const respondProposal = async (req, res) => {
  try {
    const { id, proposalId } = req.params;
    const { action } = req.body;

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({ message: 'Action must be accept or decline' });
    }

    if (isDBConnected()) {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      const proposal = post.proposals.id(proposalId);
      if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

      if (action === 'accept') {
        proposal.status = 'accepted';
        post.status = 'matched';
        await Session.create({
          requester: post.author,
          helper: proposal.user,
          skill: `${post.skillWanted} ↔ ${post.skillOffered}`,
          description: `Matched exchange from post: ${post.title}`,
          status: 'accepted',
        });
      } else {
        proposal.status = 'declined';
      }
      await post.save();
      await post.populate(['author', 'proposals.user']);
      return res.json({ post });
    } else {
      const result = memoryDB.respondProposal(id, proposalId, action);
      return res.json({ post: result.post });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    if (isDBConnected()) {
      const posts = await Post.find({ author: req.user._id })
        .populate('proposals.user', 'name email avatar rating')
        .sort({ createdAt: -1 });
      return res.json({ posts });
    } else {
      const posts = memoryDB.getPosts().filter(
        (p) => p.author?._id?.toString() === req.user._id.toString()
      );
      return res.json({ posts });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    if (isDBConnected()) {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      const idx = post.likes.indexOf(userId);
      if (idx > -1) {
        post.likes.splice(idx, 1);
      } else {
        post.likes.push(userId);
      }
      await post.save();
      await post.populate('author', 'name avatar');
      return res.json({ post });
    } else {
      const post = memoryDB.toggleLikePost(id, userId);
      return res.json({ post });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addCommentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Comment text is required' });
    const userId = req.user._id;

    if (isDBConnected()) {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      post.comments.push({
        user: userId,
        userName: req.user.name || 'Member',
        text: text.trim(),
      });
      await post.save();
      await post.populate('author', 'name avatar');
      return res.json({ post });
    } else {
      const post = memoryDB.addCommentPost(id, userId, text);
      return res.json({ post });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleBookmarkPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    if (isDBConnected()) {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      const idx = post.bookmarks.indexOf(userId);
      if (idx > -1) {
        post.bookmarks.splice(idx, 1);
      } else {
        post.bookmarks.push(userId);
      }
      await post.save();
      return res.json({ post });
    } else {
      const post = memoryDB.toggleBookmarkPost(id, userId);
      return res.json({ post });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

