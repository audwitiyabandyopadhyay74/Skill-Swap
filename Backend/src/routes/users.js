import express from 'express';
import { getUsers as getAllUsers, getUserById, getUserByName, updateProfile, getDashboardStats, toggleFollowUser } from '../controllers/userController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllUsers);
router.get('/dashboard', getDashboardStats);
router.put('/profile', updateProfile);
router.get('/by-name/:name', getUserByName);
router.get('/:id', getUserById);
router.post('/:id/follow', toggleFollowUser);

export default router;
