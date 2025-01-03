
import User from '../models/User';

export const searchUsers = async (req: any, res: any) => {
    const { query } = req.query;

    try {
        const users = await User.find({ username: new RegExp(query as string, 'i') });
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: 'Error searching users', error });
    }
};
