import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js'
import taskRouter from './routes/taskRoute.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connect
connectDB();

// Routes
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);
app.get('/', (req, res) => {
  res.send('API WORKING');
});

// Server start
app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
