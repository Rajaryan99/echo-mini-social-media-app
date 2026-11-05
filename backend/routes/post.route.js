import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { Post } from '../models/post.model.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

const uploadDir = './uploads/posts';
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
      return;
    }

    cb(new Error('Only image uploads are allowed.'));
  },
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'username bio profilePicture');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username bio profilePicture');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { content, imageUrl } = req.body;

    if ((!content || !content.trim()) && !req.file && (!imageUrl || !imageUrl.trim())) {
      return res.status(400).json({ message: 'Post content or image is required.' });
    }

    const newPost = new Post({
      userId: req.user._id,
      content: content?.trim() || '',
      imageUrl: req.file ? `/uploads/posts/${req.file.filename}` : imageUrl || '',
    });

    const savedPost = await newPost.save();
    const populatedPost = await Post.findById(savedPost._id).populate('userId', 'username bio profilePicture');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not allowed to edit this post.' });
    }

    if (req.body.content != null) {
      post.content = req.body.content.trim();
    }

    if (req.file) {
      post.imageUrl = `/uploads/posts/${req.file.filename}`;
    }

    if (req.body.imageUrl != null) {
      post.imageUrl = req.body.imageUrl;
    }

    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id).populate('userId', 'username bio profilePicture');

    res.json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not allowed to delete this post.' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
