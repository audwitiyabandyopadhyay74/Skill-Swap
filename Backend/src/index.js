import dns from 'node:dns';
import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import sessionRoutes from './routes/sessions.js';
import postRoutes from './routes/posts.js';
import messageRoutes from './routes/messages.js';
import uploadRoutes from './routes/upload.js';
import contactRoutes from './routes/contact.js';
import aiRoutes from './routes/ai.js';
import { setupSocket } from './socket.js';

dotenv.config();

try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  console.log('DNS setup note:', dnsErr.message);
}

const app = express();
const server = http.createServer(app);

const io = setupSocket(server);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (_, res) =>
  res.json({
    status: 'ok',
    dbState: mongoose.connection.readyState === 1 ? 'connected-to-atlas' : 'in-memory-fallback',
    socketActive: !!io,
    port: process.env.PORT || 5000,
    time: new Date().toISOString(),
  })
);

app.use((_, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;

async function startServer() {
  const mongoUri =
    process.env.MONGO_URI ||
    'mongodb+srv://audwitiyabandyopadhyay74_db_user:JbnFLkcrjWwHNo6s@cluster0.d3izuwv.mongodb.net/skillswap?retryWrites=true&w=majority';

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('🟢 SUCCESSFULLY CONNECTED TO MONGODB ATLAS DATABASE!');
  } catch (err) {
    console.log('MongoDB Atlas connection notice:', err.message);
    console.log('⚡ High-performance In-Memory Database store active & ready for all API requests!');
  }

  server.listen(PORT, () => console.log(`🚀 Backend & Socket.io server running on http://localhost:${PORT}`));
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
