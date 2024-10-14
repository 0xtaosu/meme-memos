import express from 'express';
import { login } from '../services/authService';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    try {
        const token = await login(username, password);
        console.log(token);
        if (token) {
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});

export default router;
