import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { memoryDB } from '../dbStore.js';
import mongoose from 'mongoose';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });

const isDBConnected = () => mongoose.connection.readyState === 1;

export const register = async (req, res) => {
  try {
    const { name, email, password, skillsOffered, skillsWanted, bio } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (isDBConnected()) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Email already registered' });
      const user = await User.create({
        name,
        email,
        password,
        skillsOffered: skillsOffered || [],
        skillsWanted: skillsWanted || [],
        bio: bio || '',
      });
      return res.status(201).json({
        user: user.toPublicJSON(),
        token: generateToken(user._id),
      });
    } else {
      const exists = memoryDB.findUserByEmail(email);
      if (exists) return res.status(400).json({ message: 'Email already registered' });
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = memoryDB.createUser({
        name,
        email,
        password: hashedPassword,
        skillsOffered: skillsOffered || [],
        skillsWanted: skillsWanted || [],
        bio: bio || '',
      });
      const publicUser = { ...user };
      delete publicUser.password;
      return res.status(201).json({ user: publicUser, token: generateToken(user._id) });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (isDBConnected()) {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      return res.json({
        user: user.toPublicJSON(),
        token: generateToken(user._id),
      });
    } else {
      const user = memoryDB.findUserByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const publicUser = { ...user };
      delete publicUser.password;
      return res.json({ user: publicUser, token: generateToken(user._id) });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  if (req.user.toPublicJSON) {
    return res.json({ user: req.user.toPublicJSON() });
  }
  const publicUser = { ...req.user };
  delete publicUser.password;
  res.json({ user: publicUser });
};
