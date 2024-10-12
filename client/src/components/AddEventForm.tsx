import React, { useState } from 'react';
import { fetchLargeTransactions } from '../utils/duneApi';

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    largeTransactions?: any[]; // 根据实际数据结构调整类型
}

interface AddEventFormProps {
    memoId: string;
    addEvent: (memoId: string, event: Event) => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ memoId, addEvent }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 创建新事件
            const newEvent: Event = {
                id: Date.now().toString(), // 简单的ID生成方式，实际应用中可能需要更复杂的逻辑
                title,
                description,
                date,
            };

            // 获取大额交易数据
            const endTime = new Date().toISOString();
            const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 24小时前
            const largeTransactions = await fetchLargeTransactions(startTime, endTime, memoId);

            // 将大额交易数据添加到事件中
            newEvent.largeTransactions = largeTransactions;

            // 调用父组件的 addEvent 函数
            addEvent(memoId, newEvent);

            // 重置表单
            setTitle('');
            setDescription('');
            setDate('');
        } catch (err) {
            setError('Failed to add event. Please try again.');
            console.error('Error adding event:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                </label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {isLoading ? 'Adding...' : 'Add Event'}
            </button>
        </form>
    );
};

export default AddEventForm;