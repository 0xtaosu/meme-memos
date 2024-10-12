import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getMemo, addEvent } from '../utils/memoApi'

interface Event {
  timestamp: string;
  description: string;
  link: string;
}

interface Memo {
  tokenAddress: string;
  events: Event[];
}

const MemoDetails: React.FC = () => {
  const { tokenAddress } = useParams<{ tokenAddress: string }>()
  const [memo, setMemo] = useState<Memo | null>(null)
  const [timestamp, setTimestamp] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMemo = async () => {
      if (tokenAddress) {
        try {
          const fetchedMemo = await getMemo(tokenAddress)
          setMemo(fetchedMemo)
        } catch (err) {
          console.error('Error fetching memo:', err)
          setError('Failed to fetch memo details.')
        }
      }
    }

    fetchMemo()
  }, [tokenAddress])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (tokenAddress && timestamp && description) {
      setIsLoading(true)
      setError('')
      try {
        const newEvent: Event = { timestamp, description, link }
        const updatedMemo = await addEvent(tokenAddress, newEvent)
        setMemo(updatedMemo)
        setTimestamp('')
        setDescription('')
        setLink('')
      } catch (err) {
        setError('Failed to add event. Please try again.')
        console.error('Error adding event:', err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (!memo) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Memo: {tokenAddress}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="timestamp" className="block text-gray-700 font-semibold mb-2">
              Timestamp
            </label>
            <input
              type="datetime-local"
              id="timestamp"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="link" className="block text-gray-700 font-semibold mb-2">
              Link (optional)
            </label>
            <input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Event'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Events</h2>
        {memo.events.length === 0 ? (
          <p className="text-gray-600">No events added yet.</p>
        ) : (
          <ul className="space-y-4">
            {memo.events.map((event, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-600 mb-2">{new Date(event.timestamp).toLocaleString()}</p>
                <p className="mb-2">{event.description}</p>
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {event.link}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default MemoDetails
