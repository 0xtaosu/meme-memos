import { MongoClient, Db, Collection, ReturnDocument } from 'mongodb';
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
    const update = {
        $set: {
            ...memoData,
            tokenAddress,
            lastUpdated: new Date()
        },
        $setOnInsert: { events: [] }
    };
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
