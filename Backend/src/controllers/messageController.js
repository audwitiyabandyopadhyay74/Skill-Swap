import Message from '../models/Message.js';
import User from '../models/User.js';
import { memoryDB } from '../dbStore.js';
import mongoose from 'mongoose';
import { uploadToCloudinary } from '../config/cloudinary.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

export const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    if (isDBConnected()) {
      const messages = await Message.find({
        $or: [{ sender: currentUserId }, { recipient: currentUserId }],
      })
        .populate('sender', 'name email avatar')
        .populate('recipient', 'name email avatar')
        .sort({ createdAt: -1 });

      const conversationsMap = new Map();
      messages.forEach((msg) => {
        const isSender = msg.sender._id.toString() === currentUserId.toString();
        const partner = isSender ? msg.recipient : msg.sender;
        const partnerId = partner._id.toString();

        if (!conversationsMap.has(partnerId)) {
          conversationsMap.set(partnerId, {
            partner,
            lastMessage: msg,
            unreadCount: !isSender && !msg.read ? 1 : 0,
          });
        } else if (!isSender && !msg.read) {
          const conv = conversationsMap.get(partnerId);
          conv.unreadCount += 1;
        }
      });

      return res.json({ conversations: Array.from(conversationsMap.values()) });
    } else {
      const conversations = memoryDB.getConversationsForUser(currentUserId);
      return res.json({ conversations });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessagesWithUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { partnerId } = req.params;

    if (isDBConnected()) {
      const messages = await Message.find({
        $or: [
          { sender: currentUserId, recipient: partnerId },
          { sender: partnerId, recipient: currentUserId },
        ],
      })
        .populate('sender', 'name avatar')
        .populate('recipient', 'name avatar')
        .sort({ createdAt: 1 });

      // Mark messages as read
      await Message.updateMany(
        { sender: partnerId, recipient: currentUserId, read: false },
        { $set: { read: true } }
      );

      const partner = await User.findById(partnerId).select('name email avatar bio skillsOffered');
      return res.json({ messages, partner });
    } else {
      const messages = memoryDB.getDirectMessages(currentUserId, partnerId);
      const partner = memoryDB.findUserById(partnerId);
      return res.json({ messages, partner });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendDirectMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { partnerId } = req.params;
    const { text, fileData } = req.body;

    if (!text?.trim() && !fileData) {
      return res.status(400).json({ message: 'Message content or attachment is required' });
    }

    let processedFileData = fileData || null;

    if (fileData?.fileUrl && fileData.fileUrl.startsWith('data:')) {
      const uploadResult = await uploadToCloudinary(fileData.fileUrl, 'skill-swap/messages');
      processedFileData = {
        ...fileData,
        fileUrl: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id,
      };
    }

    if (isDBConnected()) {
      const message = await Message.create({
        sender: senderId,
        recipient: partnerId,
        text: text?.trim() || '',
        fileData: processedFileData,
      });
      await message.populate(['sender', 'recipient']);
      return res.status(201).json({ message });
    } else {
      const message = memoryDB.createDirectMessage({
        senderId,
        recipientId: partnerId,
        text,
        fileData: processedFileData,
      });
      return res.status(201).json({ message });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
