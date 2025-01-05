import express from 'express';
import { getInitialUsers, searchUsers } from '../controllers/user';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/search', protect, searchUsers);
router.get('/initial', protect, getInitialUsers);

export default router;
