import * as jwt from 'jsonwebtoken';
import { SafeUser } from 'src/types/safeUser';



export const generateToken = (safeUser: SafeUser) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');

    return jwt.sign({ data: safeUser }, String(JWT_SECRET), { expiresIn: '7d' });
};
