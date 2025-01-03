import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: string;
}

export const protect = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token)
        return res.status(401).json({ message: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user  = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
