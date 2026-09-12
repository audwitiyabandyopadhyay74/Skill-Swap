import Session from '../models/Session.js';
import User from '../models/User.js';
import { memoryDB } from '../dbStore.js';
import mongoose from 'mongoose';

const isDBConnected = () => mongoose.connection.readyState === 1;

export const getSessions = async (req, res) => {
  try {
    if (isDBConnected()) {
      const sessions = await Session.find({
        $or: [{ requester: req.user._id }, { helper: req.user._id }],
      })
        .populate('requester', 'name email avatar rating')
        .populate('helper', 'name email avatar rating')
        .sort({ updatedAt: -1 });
      return res.json({ sessions });
    } else {
      const sessions = memoryDB.getSessionsForUser(req.user._id);
      return res.json({ sessions });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSession = async (req, res) => {
  try {
    const { helperId, skill, description, scheduledAt } = req.body;
    if (!helperId || !skill) {
      return res.status(400).json({ message: 'Helper and skill are required' });
    }

    if (isDBConnected()) {
      const helper = await User.findById(helperId);
      if (!helper) return res.status(404).json({ message: 'Helper user not found' });
      const session = await Session.create({
        requester: req.user._id,
        helper: helperId,
        skill,
        description: description || '',
        scheduledAt: scheduledAt || null,
      });
      await session.populate(['requester', 'helper']);
      return res.status(201).json({ session });
    } else {
      const helper = memoryDB.findUserById(helperId);
      const session = memoryDB.createSession({
        requester: req.user,
        helper: helper || { _id: helperId, name: 'Partner' },
        skill,
        description,
        status: 'pending',
      });
      return res.status(201).json({ session });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSessionStatus = async (req, res) => {
  try {
    const { status, rating, review, ratedBy, scheduledAt, meetingStatus, meetingRequestedBy } = req.body;
    if (isDBConnected()) {
      const session = await Session.findById(req.params.id);
      if (!session) return res.status(404).json({ message: 'Session not found' });

      if (status) session.status = status;
      if (scheduledAt !== undefined) session.scheduledAt = scheduledAt;
      if (meetingStatus !== undefined) session.meetingStatus = meetingStatus;
      if (meetingRequestedBy !== undefined) session.meetingRequestedBy = meetingRequestedBy;

      if (rating && ratedBy) {
        const isRequester = ratedBy.toString() === session.requester.toString();
        const targetUserId = isRequester ? session.helper : session.requester;

        if (isRequester) {
          session.requesterRating = Number(rating);
          if (review) session.requesterReview = review;
        } else {
          session.helperRating = Number(rating);
          if (review) session.helperReview = review;
        }

        const targetUser = await User.findById(targetUserId);
        if (targetUser) {
          const totalScore = targetUser.rating * targetUser.ratingCount + Number(rating);
          targetUser.ratingCount += 1;
          targetUser.rating = Math.round((totalScore / targetUser.ratingCount) * 10) / 10;
          if (status === 'completed' && isRequester) {
            targetUser.sessionsCompleted += 1;
            targetUser.points = (targetUser.points || 0) + 100; 
          }
          await targetUser.save();
        }
      }

      if (status === 'completed') {
        const reqUser = await User.findById(session.requester);
        if (reqUser) {
          reqUser.points = (reqUser.points || 0) + 100;
          await reqUser.save();
        }
      }

      await session.save();
      await session.populate(['requester', 'helper', 'meetingRequestedBy']);
      return res.json({ session });
    } else {
      const session = memoryDB.sessions.find((s) => s._id.toString() === req.params.id.toString());
      if (!session) return res.status(404).json({ message: 'Session not found' });
      if (status) session.status = status;
      if (scheduledAt !== undefined) session.scheduledAt = scheduledAt;
      if (meetingStatus !== undefined) session.meetingStatus = meetingStatus;
      if (meetingRequestedBy !== undefined) session.meetingRequestedBy = meetingRequestedBy;

      if (rating && ratedBy) {
        const isRequester = ratedBy.toString() === session.requester._id?.toString() || ratedBy.toString() === session.requester.toString();
        if (isRequester) {
          session.requesterRating = Number(rating);
          if (review) session.requesterReview = review;
        } else {
          session.helperRating = Number(rating);
          if (review) session.helperReview = review;
        }
      }

      return res.json({ session });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Message text is required' });

    if (isDBConnected()) {
      const session = await Session.findById(req.params.id);
      if (!session) return res.status(404).json({ message: 'Session not found' });
      session.messages.push({ sender: req.user._id, text });
      await session.save();
      const lastMsg = session.messages[session.messages.length - 1];
      return res.json({ message: lastMsg, session });
    } else {
      const msg = memoryDB.addSessionMessage(req.params.id, req.user._id, text);
      return res.json({ message: msg });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
