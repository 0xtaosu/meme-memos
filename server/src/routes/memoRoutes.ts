import express from 'express';
import { fetchTokenInfo } from '../services/dexScreenService';
import { createOrUpdateMemo, getMemoByTokenAddress, getAllMemos, addEvent } from '../services/mongoService';
import { fetchLargeTransactions } from '../services/duneService';
import { Event, Memo } from '../types/memoTypes';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { tokenAddress } = req.body;

        if (!tokenAddress) {
            return res.status(400).json({ error: 'Token address is required' });
        }

        const tokenInfo = await fetchTokenInfo(tokenAddress);

        if (!tokenInfo) {
            return res.status(404).json({ error: 'Token information not found' });
        }

        const result = await createOrUpdateMemo(tokenAddress, tokenInfo);

        res.status(201).json({ message: 'Memo created/updated successfully', result });
    } catch (error) {
        console.error('Error creating/updating memo:', error);
        res.status(500).json({ error: 'An error occurred while processing the memo' });
    }
});

router.get('/:tokenAddress', async (req, res) => {
    try {
        const { tokenAddress } = req.params;
        const memo = await getMemoByTokenAddress(tokenAddress);

        if (!memo) {
            return res.status(404).json({ error: 'Memo not found' });
        }

        res.json(memo);
    } catch (error) {
        console.error('Error fetching memo:', error);
        res.status(500).json({ error: 'An error occurred while fetching the memo' });
    }
});

router.get('/', async (req, res) => {
    try {
        const memos = await getAllMemos();
        res.json(memos);
    } catch (error) {
        console.error('Error fetching all memos:', error);
        res.status(500).json({ error: 'An error occurred while fetching memos' });
    }
});

router.post('/:tokenAddress/events', async (req, res) => {
    try {
        const { tokenAddress } = req.params;
        const { timestamp, description, link } = req.body;

        if (!timestamp || !description) {
            return res.status(400).json({ error: "Timestamp and description are required" });
        }

        const newEvent: Event = {
            timestamp: new Date(timestamp),
            description,
            link
        };

        const startTime = new Date(timestamp);
        startTime.setHours(startTime.getHours() - 24);
        const endTime = new Date(timestamp);

        try {
            const largeTransactions = await fetchLargeTransactions(
                startTime.toISOString(),
                endTime.toISOString(),
                tokenAddress
            );
            newEvent.largeTransactions = largeTransactions;
        } catch (error) {
            console.error('Error fetching large transactions:', error);
        }

        const updatedMemo = await addEvent(tokenAddress, newEvent);

        res.status(201).json(updatedMemo);
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
