import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import 'dotenv/config';
import db from './db/db.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.route.js';

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('Hello world, this is Echo, mini social media platform application');
});

app.use((err, req, res, next) => {
  if (err?.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'Image is too large. Please upload a file under 15MB.'
      : err.message;

    return res.status(400).json({ message });
  }

  if (err) {
    console.error('Unhandled error:', err);
    return res.status(500).json({ message: err.message || 'Something went wrong.' });
  }

  next();
});

app.listen(port, () => {
  db();
  console.log(`server is running on http://localhost:${port}`);
});