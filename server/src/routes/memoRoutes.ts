import express from 'express';
import { fetchTokenInfo } from '../services/dexScreenService';
import { createOrUpdateMemo, getMemoByTokenAddress, getAllMemos, addEvent, deleteMemo, deleteEvent } from '../services/mongoService';
import { fetchLargeTransactions } from '../services/duneService';
import { Event } from '../types/memoTypes';
import { authMiddleware } from '../middleware/authMiddleware';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
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

router.post('/:tokenAddress/events', authMiddleware, async (req, res) => {
    try {
        const { tokenAddress } = req.params;
        const { timestamp, description, link, endTime, minAmountUsd } = req.body;

        if (!timestamp || !description) {
            return res.status(400).json({ error: "Timestamp and description are required" });
        }

        const newEvent: Event = {
            _id: uuidv4(),
            timestamp: new Date(timestamp),
            description,
            link
        };

        const startTime = new Date(timestamp);
        startTime.setHours(startTime.getHours() - 24);
        const eventEndTime = endTime ? new Date(endTime) : new Date(timestamp);
        const minAmount = minAmountUsd ? parseFloat(minAmountUsd) : 1000;

        try {
            console.log(startTime.toISOString() + " " + eventEndTime.toISOString() + minAmount)
            const largeTransactions = await fetchLargeTransactions(
                startTime.toISOString(),
                eventEndTime.toISOString(),
                tokenAddress,
                minAmount
            );
            newEvent.largeTransactions = largeTransactions;
        } catch (error) {
            console.error('Error fetching large transactions:', error);
        }

        const updatedMemo = await addEvent(tokenAddress, newEvent);

        res.status(201).json(updatedMemo);
    } catch (error) {
        console.error(`Error adding event:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:tokenAddress', authMiddleware, async (req, res) => {
    try {
        const { tokenAddress } = req.params;
        const result = await deleteMemo(tokenAddress);

        if (result) {
            res.json({ message: 'Memo deleted successfully' });
        } else {
            res.status(404).json({ error: 'Memo not found' });
        }
    } catch (error) {
        console.error('Error deleting memo:', error);
        res.status(500).json({ error: 'An error occurred while deleting the memo' });
    }
});

router.delete('/:tokenAddress/events/:eventId', authMiddleware, async (req, res) => {
    const { tokenAddress, eventId } = req.params;

    try {
        const memo = await getMemoByTokenAddress(tokenAddress);

        if (!memo) {
            return res.status(404).json({ error: 'Memo not found' });
        }

        const updatedEvents = memo.events.filter(event => event._id !== eventId);

        if (updatedEvents.length === memo.events.length) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // 使用 createOrUpdateMemo 函数更新 memo
        const updatedMemo = await createOrUpdateMemo(tokenAddress, { events: updatedEvents });

        res.status(200).json(updatedMemo); // 返回完整的更新后的 memo 对象
    } catch (error) {
        console.error(`Error deleting event:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
