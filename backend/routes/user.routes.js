import express from 'express';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import { User } from '../models/user.model.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

const profileUploadDir = './uploads/profiles';
fs.mkdirSync(profileUploadDir, { recursive: true });

const profileUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, profileUploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
      return;
    }

    cb(new Error('Only image files are allowed for profile pictures.'));
  },
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const getUser = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.id).select('-password');
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
};

router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

router.patch('/me/profile', authMiddleware, profileUpload.single('profilePicture'), async (req, res) => {
  try {
    const { bio } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (bio != null) {
      user.bio = bio.trim();
    }

    if (req.file) {
      user.profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    const updatedUser = await user.save();
    const { password, ...safeUser } = updatedUser.toObject();
    res.json(safeUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', getUser, (req, res) => {
  res.json(res.user);
});

router.post('/register', async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    bio: req.body.bio,
    profilePicture: req.body.profilePicture,
  });

  try {
    const newUser = await user.save();
    const { password, ...safeUser } = newUser.toObject();
    res.status(201).json(safeUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log('Error in user registration:', err.message);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret is not configured.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const { password: _, ...safeUser } = user.toObject();
    res.json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/update/:id', getUser, async (req, res) => {
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  if (req.body.bio != null) {
    res.user.bio = req.body.bio;
  }
  if (req.body.profilePicture != null) {
    res.user.profilePicture = req.body.profilePicture;
  }

  try {
    const updatedUser = await res.user.save();
    const { password, ...safeUser } = updatedUser.toObject();
    res.json(safeUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/delete/:id', getUser, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;