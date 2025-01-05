import express from 'express';
import {
    sendFriendRequest,
    handleFriendRequest,
    getFriendsList,
    getFriendRecommendations,
    getFollowStatus,
} from '../controllers/friend';
import { getInitialUsers } from '../controllers/user';
import { protect } from '../middlewares/authMiddleware';

const friendrouter = express.Router();

friendrouter.post('/request/:userId', protect, sendFriendRequest);
friendrouter.post('/handle-request/:requestId', protect, handleFriendRequest);
friendrouter.get('/list', protect, getFriendsList);
friendrouter.get('/recommendations', protect, getFriendRecommendations);
friendrouter.get('/status/:userId', protect, getFollowStatus);
friendrouter.get('/initial', protect, getInitialUsers);

export default friendrouter;
