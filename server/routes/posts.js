import express from 'express';

import {createPost, deletePost, getPosts, likePost, updatePost} from '../controllers/posts.js';
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/get-all-posts', getPosts);
router.post('/create', auth, createPost);
router.patch('/:id/update', auth, updatePost);
router.delete('/:id/delete', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

export default router;