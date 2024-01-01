import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import ticketRouter from './Ticket/ticketRoutes'
//import { syncMongoDBWithElasticsearch } from './elasticSearch/initialSync'; // Assuming
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Replace with your MongoDB connection string
const mongoUri = 'mongodb://local_dev:local_dev@mongodb:27017/local_dev?authSource=admin';

//syncMongoDBWithElasticsearch().then(() => console.log('Sync complete.'))
//    .catch((err: Error) => console.error('An error occurred:', err));
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(ticketRouter); // Using the user routes

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
