import express from 'express';
import { searchUsers } from '../controllers/user';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/search', protect, searchUsers);

export default router;
