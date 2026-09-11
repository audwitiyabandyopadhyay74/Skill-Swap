import express from 'express';
import { generatePostContent, generateRoadmap, generateSwapIdeas } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate-post', protect, generatePostContent);
router.post('/generate-roadmap', protect, generateRoadmap);
router.post('/generate-swap-ideas', protect, generateSwapIdeas);

export default router;

