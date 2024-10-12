import axios from 'axios';

// 假设您的后端 API 基础 URL 存储在环境变量中
const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your actual API URL

interface Memo {
    tokenAddress: string;
    events: Event[];
}

interface Event {
    timestamp: string;
    description: string;
    link: string;
}

export const getAllMemos = async (): Promise<Memo[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/memos`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all memos:', error);
        throw error;
    }
};

export const getMemo = async (tokenAddress: string): Promise<Memo> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/memos/${tokenAddress}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching memo:', error);
        throw error;
    }
};

export const createMemo = async (tokenAddress: string): Promise<Memo> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/memos`, { tokenAddress, events: [] });
        return response.data;
    } catch (error) {
        console.error('Error creating memo:', error);
        throw error;
    }
};

export const addEvent = async (tokenAddress: string, event: Event): Promise<Memo> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/memos/${tokenAddress}/events`, event);
        return response.data;
    } catch (error) {
        console.error('Error adding event:', error);
        throw error;
    }
};
