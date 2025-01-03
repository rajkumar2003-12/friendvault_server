
import bcrypt from 'bcryptjs';
import User from '../models/User';
import generateToken from '../utils/generateToken';

export const signUp = async (req: any, res: any) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });
        res.status(201).json({ id: user.id, username: user.username, token: generateToken(user.id) });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
};

export const login = async (req: any, res: any) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({ id: user.id, username: user.username, token: generateToken(user.id) });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error logging in', error });
    }
};
