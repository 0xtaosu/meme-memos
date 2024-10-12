import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchLargeTransactions } from '../utils/duneApi'

interface Memo {
  tokenInfo: {
    name: string;
    symbol: string;
    priceUsd: string;
    liquidity: string;
    volume24h: string;
  };
  events: Array<{
    time: string;
    content: string;
    link: string;
    largeTransactions?: Array<{
      amount_usd: number;
      block_time: string;
      buyer_address: string;
      token_bought_amount: number;
      tx_hash: string;
    }>
  }>;
}

interface MemoDetailsProps {
  memos: Record<string, Memo>
  addEvent: (tokenAddress: string, event: { time: string; content: string; link: string; largeTransactions?: any[] }) => void
}

const MemoDetails: React.FC<MemoDetailsProps> = ({ memos, addEvent }) => {
  const { tokenAddress } = useParams<{ tokenAddress: string }>()
  const [time, setTime] = useState('')
  const [content, setContent] = useState('')
  const [link, setLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedEvents, setExpandedEvents] = useState<Record<number, boolean>>({})

  const memo = memos[tokenAddress || '']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (tokenAddress && time && content) {
      setIsLoading(true)
      setError('')
      try {
        const endTime = new Date().toISOString()
        const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 24 hours ago
        const largeTransactions = await fetchLargeTransactions(startTime, endTime, tokenAddress)

        addEvent(tokenAddress, { time, content, link, largeTransactions })
        setTime('')
        setContent('')
        setLink('')
      } catch (err) {
        setError('Failed to fetch large transactions. The event was not added.')
        console.error('Error fetching large transactions:', err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const toggleEventExpansion = (index: number) => {
    setExpandedEvents(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
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
                {event.largeTransactions && event.largeTransactions.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => toggleEventExpansion(index)}
                      className="text-blue-600 hover:underline focus:outline-none"
                    >
                      {expandedEvents[index] ? 'Hide' : 'Show'} Large Transactions ({event.largeTransactions.length})
                    </button>
                    {expandedEvents[index] && (
                      <table className="w-full table-auto mt-2">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left">Buyer</th>
                            <th className="px-4 py-2 text-left">Amount (USD)</th>
                            <th className="px-4 py-2 text-left">Token Amount</th>
                            <th className="px-4 py-2 text-left">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {event.largeTransactions.map((tx, txIndex) => (
                            <tr key={txIndex} className={txIndex % 2 === 0 ? 'bg-gray-100' : ''}>
                              <td className="border px-4 py-2">{tx.buyer_address}</td>
                              <td className="border px-4 py-2">${tx.amount_usd.toFixed(2)}</td>
                              <td className="border px-4 py-2">{tx.token_bought_amount.toFixed(2)}</td>
                              <td className="border px-4 py-2">{new Date(tx.block_time).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
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
