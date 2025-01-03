import express from 'express';
import {
    sendFriendRequest,
    handleFriendRequest,
    getFriendsList,
    getFriendRecommendations,
} from '../controllers/friend';
import { protect } from '../middlewares/authMiddleware';

const friendrouter = express.Router();

friendrouter.post('/request/:userId', protect, sendFriendRequest);
friendrouter.post('/handle-request/:requestId', protect, handleFriendRequest);
friendrouter.get('/list', protect, getFriendsList);
friendrouter.get('/recommendations', protect, getFriendRecommendations);

export default friendrouter;
