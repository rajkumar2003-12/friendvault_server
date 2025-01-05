import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import friendrouter from './routes/friendRoutes';
import { protect } from './middlewares/authMiddleware';
import cors from "cors"

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true 
  }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', protect, friendrouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

