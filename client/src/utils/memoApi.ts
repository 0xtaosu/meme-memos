import axios from 'axios';
import { Memo } from '../types';

// 假设您的后端 API 基础 URL 存储在环境变量中
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'; // Replace with your actual API URL

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface Event {
    timestap: string;
    description: string;
    link: string;
    startTime?: string;
    minAmountUsd?: number;
}

export const getAllMemos = async (): Promise<Memo[]> => {
    try {
        const response = await axiosInstance.get('/memos');
        return response.data;
    } catch (error) {
        console.error('Error fetching all memos:', error);
        throw error;
    }
};

export const getMemo = async (tokenAddress: string): Promise<Memo> => {
    try {
        const response = await axiosInstance.get(`/memos/${tokenAddress}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching memo:', error);
        throw error;
    }
};

export const createMemo = async (tokenAddress: string): Promise<Memo> => {
    try {
        const response = await axiosInstance.post('/memos', { tokenAddress, events: [] });
        return response.data;
    } catch (error) {
        console.error('Error creating memo:', error);
        throw error;
    }
};

export const addEvent = async (tokenAddress: string, event: Event): Promise<Memo> => {
    try {
        const response = await axiosInstance.post(`/memos/${tokenAddress}/events`, event);
        return response.data;
    } catch (error) {
        console.error('Error adding event:', error);
        throw error;
    }
};

export const deleteMemo = async (tokenAddress: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/memos/${tokenAddress}`);
    } catch (error) {
        console.error('Error deleting memo:', error);
        throw error;
    }
};

export const deleteEvent = async (tokenAddress: string, eventId: string): Promise<Memo> => {
    try {
        const response = await axiosInstance.delete(`/memos/${tokenAddress}/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};
