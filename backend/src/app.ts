import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './User/userRoutes'

const app = express();
const port = 8000;

// Replace with your MongoDB connection string
const mongoUri = 'mongodb://local_dev:local_dev@mongodb:27017/local_dev?authSource=admin';

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(userRoutes); // Using the user routes

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
