import { MongoClient, Db, Collection, ReturnDocument, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { Memo } from '../types/memoTypes';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoUrl = process.env.MONGODB_URL;

console.log('MongoDB URL:', mongoUrl);

if (!mongoUrl) {
    throw new Error('Missing MongoDB URL');
}

let client: MongoClient;
let db: Db;
let memos: Collection<Memo>;

export async function connectToDatabase(): Promise<void> {
    if (db) return;
    console.log('Attempting to connect to MongoDB...');
    try {
        client = await MongoClient.connect(mongoUrl as string);
        db = client.db('meme_memos');
        memos = db.collection<Memo>('memos');
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

export async function createOrUpdateMemo(tokenAddress: string, memoData: Partial<Memo>): Promise<Memo> {
    await connectToDatabase();

    const filter = { tokenAddress };
    let update: any = {
        $set: {
            ...memoData,
            tokenAddress,
            lastUpdated: new Date()
        }
    };

    // 如果是新文档，初始化 events 数组
    if (!memoData.events) {
        update.$setOnInsert = { events: [] };
    }

    const options = { upsert: true, returnDocument: ReturnDocument.AFTER };

    const result = await memos.findOneAndUpdate(filter, update, options);

    if (!result) {
        throw new Error('Failed to create or update memo');
    }

    return result;
}

export async function getMemoByTokenAddress(tokenAddress: string): Promise<Memo | null> {
    await connectToDatabase();
    return await memos.findOne({ tokenAddress });
}

export async function getAllMemos(): Promise<Memo[]> {
    await connectToDatabase();
    return await memos.find().toArray();
}

export async function addEvent(tokenAddress: string, event: any): Promise<Memo> {
    await connectToDatabase();

    const filter = { tokenAddress };
    const update = {
        $push: { events: event }
    };
    const options = { returnDocument: ReturnDocument.AFTER };

    const result = await memos.findOneAndUpdate(filter, update, options);

    if (!result) {
        throw new Error('Failed to add event to memo');
    }

    return result;
}

export async function addLargeTransactions(eventId: string, transactions: any[]) {
    await connectToDatabase();
    const largeTransactions = db.collection('large_transactions');

    const formattedTransactions = transactions.map(tx => ({
        event_id: eventId,
        amount_usd: tx.amount_usd,
        block_time: new Date(tx.block_time),
        buyer_address: tx.buyer_address,
        token_bought_amount: tx.token_bought_amount,
        tx_hash: tx.tx_hash
    }));

    const result = await largeTransactions.insertMany(formattedTransactions);

    console.log('Successfully added large transactions:', result);
    return result;
}

// Add these new functions after the existing functions

export async function deleteMemo(tokenAddress: string): Promise<boolean> {
    await connectToDatabase();

    const result = await memos.deleteOne({ tokenAddress });

    return result.deletedCount === 1;
}

export async function deleteEvent(memoId: string, eventId: string) {
    if (!eventId || eventId === 'undefined') {
        throw new Error('Invalid event ID');
    }

    try {
        const result = await memos.deleteOne({ _id: new ObjectId(eventId), memoId });
        if (result.deletedCount === 0) {
            throw new Error('Event not found');
        }
        return result;
    } catch (error) {
        if (error instanceof Error && error.message === 'Invalid event ID') {
            throw error;
        }
        console.error('Error deleting event:', error);
        throw new Error('Failed to delete event');
    }
}
