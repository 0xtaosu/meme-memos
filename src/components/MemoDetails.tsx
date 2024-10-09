import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

interface Memo {
  tokenInfo: {
    name: string;
    symbol: string;
    priceUsd: string;
    liquidity: string;
    volume24h: string;
  };
  events: Array<{ time: string; content: string; link: string }>;
}

interface MemoDetailsProps {
  memos: Record<string, Memo>
  addEvent: (tokenAddress: string, event: { time: string; content: string; link: string }) => void
}

const MemoDetails: React.FC<MemoDetailsProps> = ({ memos, addEvent }) => {
  const { tokenAddress } = useParams<{ tokenAddress: string }>()
  const [time, setTime] = useState('')
  const [content, setContent] = useState('')
  const [link, setLink] = useState('')

  const memo = memos[tokenAddress || '']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tokenAddress && time && content) {
      addEvent(tokenAddress, { time, content, link })
      setTime('')
      setContent('')
      setLink('')
    }
  }

  if (!memo) {
    return <div>Memo not found</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Memo: {memo.tokenInfo.name} ({memo.tokenInfo.symbol})</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Token Information</h2>
        <p><strong>Price:</strong> ${parseFloat(memo.tokenInfo.priceUsd).toFixed(6)}</p>
        <p><strong>Liquidity:</strong> ${parseFloat(memo.tokenInfo.liquidity).toLocaleString()}</p>
        <p><strong>24h Volume:</strong> ${parseFloat(memo.tokenInfo.volume24h).toLocaleString()}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="time" className="block text-gray-700 font-semibold mb-2">
              Time
            </label>
            <input
              type="datetime-local"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
          >
            Add Event
          </button>
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
                <p className="text-gray-600 mb-2">{new Date(event.time).toLocaleString()}</p>
                <p className="mb-2">{event.content}</p>
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