import { Server } from 'socket.io';
import Session from './models/Session.js';
import Message from './models/Message.js';
import { memoryDB } from './dbStore.js';
import mongoose from 'mongoose';

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001, "https://skillswap-dun-tau.vercel.app/'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected to Socket.io: ${socket.id}`);

    socket.on('join-room', ({ roomId, userId, userName }) => {
      socket.join(roomId);
      console.log(`User ${userName} (${userId}) joined room: ${roomId}`);
      socket.to(roomId).emit('user-joined', { userId, userName, socketId: socket.id });
    });

    socket.on('leave-room', ({ roomId }) => {
      socket.leave(roomId);
      socket.to(roomId).emit('user-left', { socketId: socket.id });
    });

    socket.on('send-message', async ({ roomId, senderId, senderName, text, fileData }) => {
      const messageData = {
        _id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        sender: senderId,
        senderName: senderName || 'User',
        text: text || '',
        fileData: fileData || null,
        createdAt: new Date().toISOString(),
      };

      try {
        if (mongoose.connection.readyState === 1) {
          const session = await Session.findById(roomId);
          if (session) {
            session.messages.push({ sender: senderId, text: text || '', fileData: fileData || null });
            await session.save();
          }
        } else {
          memoryDB.addSessionMessage(roomId, senderId, text || '');
        }
      } catch (err) {
        console.error('Socket message save notice:', err.message);
      }

      io.in(roomId).emit('receive-message', messageData);
    });

    socket.on('join-user-room', ({ userId }) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`Socket ${socket.id} joined personal room: user_${userId}`);
      }
    });

    socket.on('send-direct-message', async ({ senderId, recipientId, senderName, text, fileData }) => {
      const dmData = {
        _id: 'dm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        sender: senderId,
        recipient: recipientId,
        senderName: senderName || 'Member',
        text: text || '',
        fileData: fileData || null,
        createdAt: new Date().toISOString(),
      };

      try {
        if (mongoose.connection.readyState === 1) {
          await Message.create({ sender: senderId, recipient: recipientId, text: text || '', fileData: fileData || null });
        } else {
          memoryDB.createDirectMessage({ senderId, recipientId, text: text || '', fileData: fileData || null });
        }
      } catch (err) {
        console.error('Direct message socket save notice:', err.message);
      }

      io.in(`user_${senderId}`).emit('receive-direct-message', dmData);
      io.in(`user_${recipientId}`).emit('receive-direct-message', dmData);
    });

    socket.on('typing-direct-message', ({ senderId, recipientId, isTyping }) => {
      socket.to(`user_${recipientId}`).emit('partner-typing', { senderId, isTyping });
    });

    socket.on('sync-notes', async ({ roomId, notes }) => {
      socket.to(roomId).emit('receive-notes-sync', { notes });
      try {
        if (mongoose.connection.readyState === 1) {
          await Session.findByIdAndUpdate(roomId, { notes });
        }
      } catch (err) {
        console.error('Sync notes DB notice:', err.message);
      }
    });

    socket.on('call-user', ({ roomId, signalData, from, callerName }) => {
      console.log(`Video call initiated in room ${roomId} by ${callerName}`);
      socket.to(roomId).emit('incoming-call', {
        signalData,
        from,
        callerName,
        callerSocketId: socket.id,
      });
    });

    socket.on('answer-call', ({ roomId, signalData, to }) => {
      console.log(`Video call answered in room ${roomId}`);
      socket.to(roomId).emit('call-accepted', {
        signalData,
        responderSocketId: socket.id,
      });
    });

    socket.on('ice-candidate', ({ roomId, candidate }) => {
      socket.to(roomId).emit('ice-candidate', { candidate });
    });

    socket.on('end-call', ({ roomId }) => {
      console.log(`Video call ended in room ${roomId}`);
      io.in(roomId).emit('call-ended');
    });

    socket.on('end-call-for-all', ({ roomId }) => {
      console.log(`Video call ended for all in room ${roomId}`);
      io.in(roomId).emit('call-ended');
    });

    socket.on('send-caption', ({ roomId, text, senderName }) => {
      socket.to(roomId).emit('receive-caption', { text, senderName, id: Date.now() });
    });

    socket.on('send-reaction', ({ roomId, emoji, senderName }) => {
      io.in(roomId).emit('receive-reaction', { emoji, senderName, id: Date.now() + Math.random() });
    });

    socket.on('draw-stroke', ({ roomId, strokeData }) => {
      socket.to(roomId).emit('receive-stroke', { strokeData });
    });

    socket.on('clear-whiteboard', ({ roomId }) => {
      io.in(roomId).emit('whiteboard-cleared');
    });

    socket.on('remote-mute-participant', ({ roomId, targetUserId }) => {

      console.log(`Host muted participant ${targetUserId} in room ${roomId}`);
      socket.to(roomId).emit('host-muted-you', { targetUserId });
    });

    socket.on('complete-meeting', async ({ roomId, userId, isRequester, isHelper }) => {
      console.log(`Meeting completion requested by user ${userId} in room ${roomId}`);
      try {
        let isFullyCompleted = false;

        if (mongoose.connection.readyState === 1) {
          const session = await Session.findById(roomId);
          if (session) {
            if (isRequester) session.requesterCompleted = true;
            if (isHelper) session.helperCompleted = true;

            if (session.requesterCompleted && session.helperCompleted) {
              session.status = 'completed';
              session.meetingStatus = 'completed';
              session.completedAt = new Date();
              isFullyCompleted = true;
            }
            await session.save();
          }
        } else {
          const session = memoryDB.sessions.find((s) => s._id.toString() === roomId.toString());
          if (session) {
            if (isRequester) session.requesterCompleted = true;
            if (isHelper) session.helperCompleted = true;

            if (session.requesterCompleted && session.helperCompleted) {
              session.status = 'completed';
              session.meetingStatus = 'completed';
              session.completedAt = new Date();
              isFullyCompleted = true;
            }
          }
        }

        if (isFullyCompleted) {
          io.in(roomId).emit('meeting-completed');
        } else {
          io.in(roomId).emit('participant-marked-completed', {
            userId,
            isRequester,
            isHelper,
          });
        }
      } catch (err) {
        console.error('Error completing meeting:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

  });

  return io;
}
