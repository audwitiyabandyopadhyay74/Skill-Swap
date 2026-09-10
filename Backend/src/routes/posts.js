import express from 'express';
import {
  getPosts,
  createPost,
  sendProposal,
  respondProposal,
  getMyPosts,
  toggleLikePost,
  addCommentPost,
  toggleBookmarkPost,
} from '../controllers/postController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getPosts);
router.post('/', createPost);
router.get('/myposts', getMyPosts);
router.post('/:id/proposals', sendProposal);
router.patch('/:id/proposals/:proposalId', respondProposal);
router.post('/:id/like', toggleLikePost);
router.post('/:id/comment', addCommentPost);
router.post('/:id/bookmark', toggleBookmarkPost);

export default router;
