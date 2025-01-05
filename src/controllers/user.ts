import mongoose from 'mongoose';
import User from '../models/User';


export const Initial = async (req: any, res: any) => {
    const { query } = req.query;

    try {
        const users = await User.find({ username: new RegExp(query as string, 'i') });
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: 'Error searching users', error });
    }
};


export const getInitialUsers = async (req: any, res: any) => {
  try {
    const loggedInUserId = req.user; 

    const loggedInUser = await User.findById(loggedInUserId, "friends");
    if (!loggedInUser) {
      return res.status(404).json({ message: "Logged-in user not found" });
    }

   
    const initialUsers = await User.find({ _id: { $ne: loggedInUserId } }, "username");

   
    const usersWithFollowStatus = initialUsers.map((user) => ({
      _id: user._id,
      username: user.username,
      isFollowed: loggedInUser.friends.some(
        (friendId) => friendId.toString() === (user._id as mongoose.Types.ObjectId).toString()
      ), 
    }));

    res.status(200).json({
      users: usersWithFollowStatus,
      loggedInUserId,
      loggedInUserFriends: loggedInUser.friends.map((friendId) => friendId.toString()),
    });
  } catch (error) {
    console.error("Error fetching initial users:", error);
    res.status(500).json({ message: "Failed to fetch initial users", error });
  }
};

export const searchUsers = async (req: any, res: any) => {
  
  try {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const users = await User.find({ username: new RegExp(username, 'i') })
        .select('id username friends friendRequests') 
        .populate('friends', 'username') 
        .populate('friendRequests', 'username'); 

    
    if (!users.length) {
        return res.status(404).json({ message: 'No users found' });
    }

    return res.status(200).json(users);
} catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
}
}
