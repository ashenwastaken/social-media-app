import express from 'express';
import { getFeedPosts, getUserPosts, likePost } from '../Controllers/post.js';
import { verifyToken } from '../Middlewares/auth.js';

const router = express.Router();

router.get('/', verifyToken, getFeedPosts);
router.get("/:userId/post", verifyToken, getUserPosts);

router.patch("/:id/like", verifyToken, likePost);

export default router;