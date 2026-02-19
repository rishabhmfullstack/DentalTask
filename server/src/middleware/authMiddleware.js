import * as jose from 'jose';

export default async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);
        req.user = payload;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
