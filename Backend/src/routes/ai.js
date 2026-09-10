import express from 'express';
import { generatePostContent, generateRoadmap } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate-post', protect, generatePostContent);
router.post('/generate-roadmap', protect, generateRoadmap);

export default router;
