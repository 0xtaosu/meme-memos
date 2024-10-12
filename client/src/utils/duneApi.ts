import axios from 'axios';

// 假设您的后端 API 基础 URL 存储在环境变量中
const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your actual API URL

export const fetchLargeTransactions = async (startTime: string, endTime: string, tokenAddress: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dune/large-transactions`, {
            params: { startTime, endTime, tokenAddress }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching large transactions:', error);
        throw error;
    }
};