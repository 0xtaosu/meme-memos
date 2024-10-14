import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { USER_NAME, USER_PASSWORD, JWT_SECRET } = process.env;

export async function login(username: string, password: string): Promise<string | null> {
    if (username === USER_NAME && password === USER_PASSWORD) {
        return jwt.sign({ username }, JWT_SECRET as string, { expiresIn: '1h' });
    }
    return null;
}