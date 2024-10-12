import React, { useState } from 'react';
import { addEvent } from '../utils/memoApi';

interface Event {
    timestamp: string;
    description: string;
    link: string;
}

interface AddEventFormProps {
    tokenAddress: string;
    onEventAdded: () => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ tokenAddress, onEventAdded }) => {
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const newEvent: Event = {
                timestamp,
                description,
                link,
            };

            await addEvent(tokenAddress, newEvent);

            // Reset form
            setDescription('');
            setLink('');
            setTimestamp('');

            // Notify parent component that an event was added
            onEventAdded();
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
                <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                    Link
                </label>
                <input
                    type="url"
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700">
                    Timestamp
                </label>
                <input
                    type="datetime-local"
                    id="timestamp"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
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
