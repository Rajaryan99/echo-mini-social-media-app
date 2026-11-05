import express from 'express';
import 'dotenv/config';
import db from './db/db.js';
import userRoutes from './routes/user.routes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello world, this is Echo, mini social media platform application');
});

app.listen(port, () => {
  db();
  console.log(`server is running on http://localhost:${port}`);
});