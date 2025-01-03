
import User from '../models/User';
import mongoose from 'mongoose';

export const sendFriendRequest = async (req: any, res: any) => {
    const { userId } = req.params;
    const senderId = req.user;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const receiver = await User.findById(userId);
        const sender = await User.findById(senderId);

        if (!receiver || !sender) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (receiver.friends.includes(senderId)) {
            return res.status(400).json({ message: 'Already friends' });
        }

        if (receiver.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        receiver.friendRequests.push(senderId);
        await receiver.save();

        res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending friend request', error });
    }
};

export const handleFriendRequest = async (req: any, res: any) => {
    const { requestId } = req.params;
    const { action } = req.body; // "accept" or "reject"
    const userId = req.user;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ message: 'Invalid request ID' });
    }

    try {
        const user = await User.findById(userId);
        const sender = await User.findById(requestId);

        if (!user || !sender) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(requestId)
        console.log(userId)
        if (!user.friendRequests.includes(requestId)) {
            return res.status(400).json({ message: 'No such friend request' });
        }

        if (action === 'accept') {
            user.friends.push(requestId);
            sender.friends.push(userId);
        }

        user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requestId);
        await user.save();
        await sender.save();

        res.status(200).json({ message: `Friend request ${action}ed` });
    } catch (error) {
        res.status(500).json({ message: 'Error handling friend request', error });
    }
};

export const getFriendsList = async (req: any, res: any) => {
    const userId = req.user;

    try {
        const user = await User.findById(userId).populate('friends', 'username');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.friends);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching friends list', error });
    }
};

export const getFriendRecommendations = async (req: any, res: any) => {
    const userId = req.user;

    try {
        const user = await User.findById(userId).populate('friends');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find mutual friends
        const mutualFriendsMap: Record<string, number> = {};
        for (const friend of user.friends) {
            const friendData = await User.findById(friend._id).populate('friends');

            if (friendData) {
                for (const mutualFriend of friendData.friends) {
                    if (mutualFriend._id.toString() !== userId && !user.friends.includes(mutualFriend._id) && !mutualFriendsMap[mutualFriend._id.toString()]) 
                        {
                        mutualFriendsMap[mutualFriend._id.toString()] = 1;
                    } else {
                        mutualFriendsMap[mutualFriend._id.toString()]++;
                    }
                }
            }
        }

        const recommendations = await User.find({
            _id: { $in: Object.keys(mutualFriendsMap) },
        }).select('username');

        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching friend recommendations', error });
    }
};
