import User from '../models/User.js';
import Session from '../models/Session.js';
import { memoryDB } from '../dbStore.js';
import mongoose from 'mongoose';

const isDBConnected = () => mongoose.connection.readyState === 1;

export const getUsers = async (req, res) => {
  try {
    const { search, skill } = req.query;
    if (isDBConnected()) {
      const query = { _id: { $ne: req.user._id } };
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { skillsOffered: new RegExp(search, 'i') },
          { skillsWanted: new RegExp(search, 'i') },
        ];
      }
      if (skill) query.skillsOffered = new RegExp(skill, 'i');
      const users = await User.find(query).select('-password');
      return res.json({ users });
    } else {
      const users = memoryDB.getUsers({ search }).filter(
        (u) => u._id.toString() !== req.user._id.toString()
      );
      return res.json({ users });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    if (isDBConnected()) {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({ user });
    } else {
      const user = memoryDB.findUserById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const publicUser = { ...user };
      delete publicUser.password;
      return res.json({ user: publicUser });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { bio, avatar, skillsOffered, skillsWanted, name } = req.body;
    if (isDBConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (name) user.name = name;
      if (bio !== undefined) user.bio = bio;
      if (avatar !== undefined) user.avatar = avatar;
      if (skillsOffered) user.skillsOffered = skillsOffered;
      if (skillsWanted) user.skillsWanted = skillsWanted;
      await user.save();
      return res.json({ user: user.toPublicJSON() });
    } else {
      const updates = {};
      if (name) updates.name = name;
      if (bio !== undefined) updates.bio = bio;
      if (avatar !== undefined) updates.avatar = avatar;
      if (skillsOffered) updates.skillsOffered = skillsOffered;
      if (skillsWanted) updates.skillsWanted = skillsWanted;
      const updated = memoryDB.updateUser(req.user._id, updates);
      const publicUser = { ...updated };
      delete publicUser.password;
      return res.json({ user: publicUser });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    if (isDBConnected()) {
      const user = await User.findById(req.user._id).select('-password');
      const upcomingSessions = await Session.find({
        $or: [{ requester: req.user._id }, { helper: req.user._id }],
        status: { $in: ['accepted', 'in-progress'] },
      })
        .populate('requester', 'name avatar')
        .populate('helper', 'name avatar');
      return res.json({
        user: user.toPublicJSON(),
        stats: {
          sessionsCompleted: user.sessionsCompleted,
          connectionsCount: user.connections?.length || 0,
          skillsOfferedCount: user.skillsOffered?.length || 0,
          rating: user.rating,
        },
        upcomingSessions,
      });
    } else {
      const user = memoryDB.findUserById(req.user._id) || req.user;
      const sessions = memoryDB.getSessionsForUser(req.user._id);
      const upcomingSessions = sessions.filter((s) => ['accepted', 'in-progress'].includes(s.status));
      const publicUser = { ...user };
      delete publicUser.password;
      return res.json({
        user: publicUser,
        stats: {
          sessionsCompleted: user.sessionsCompleted || 0,
          connectionsCount: user.connections?.length || 0,
          skillsOfferedCount: user.skillsOffered?.length || 0,
          rating: user.rating || 4.8,
        },
        upcomingSessions,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleFollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === targetUserId.toString()) {
      return res.status(400).json({ message: 'You cannot connect with yourself' });
    }

    if (isDBConnected()) {
      const currentUser = await User.findById(currentUserId);
      if (!currentUser) return res.status(404).json({ message: 'User not found' });
      const idx = currentUser.connections.indexOf(targetUserId);
      let isFollowing = false;
      if (idx > -1) {
        currentUser.connections.splice(idx, 1);
        isFollowing = false;
      } else {
        currentUser.connections.push(targetUserId);
        currentUser.points = (currentUser.points || 100) + 25; // +25 points for making a friend
        isFollowing = true;
      }
      await currentUser.save();
      return res.json({ isFollowing, connections: currentUser.connections, user: currentUser.toPublicJSON() });
    } else {
      const result = memoryDB.toggleFollowUser(currentUserId, targetUserId);
      if (result.isFollowing && result.currentUser) {
        result.currentUser.points = (result.currentUser.points || 100) + 25;
      }
      return res.json({ isFollowing: result.isFollowing, connections: result.currentUser.connections, user: result.currentUser });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


