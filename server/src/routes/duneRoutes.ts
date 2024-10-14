import express from 'express';
import { fetchLargeTransactions } from '../services/duneService';

const router = express.Router();

router.get('/large-transactions', async (req, res) => {
    try {
        const { timestamp, startTime, tokenAddress } = req.query;
        if (!timestamp || !startTime || !tokenAddress) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        const transactions = await fetchLargeTransactions(timestamp as string, startTime as string, tokenAddress as string);
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching large transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;