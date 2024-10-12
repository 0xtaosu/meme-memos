import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getMemo, addEvent } from '../utils/memoApi'
import { Memo, Event, LargeTransaction } from '../types'
import { Skull, Scroll, Coins } from 'lucide-react'

const MemoDetails: React.FC = () => {
  const { tokenAddress } = useParams<{ tokenAddress: string }>()
  const [memo, setMemo] = useState<Memo | null>(null)
  const [timestamp, setTimestamp] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedEvents, setExpandedEvents] = useState<number[]>([])

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
        const newEvent: Event = { timestamp, description, link: link ?? '' }
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

  const toggleEventExpansion = (index: number) => {
    setExpandedEvents(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  if (!memo) {
    return <div className="text-amber-100">Summoning the arcane knowledge...</div>
  }

  return (
    <div className="bg-gray-900 text-amber-100 p-8">
      {/* Token Information */}
      <div className="flex items-center mb-6">
        {memo.imageUrl && (
          <img
            src={memo.imageUrl}
            alt={`${memo.symbol} sigil`}
            className="w-16 h-16 mr-4 rounded-full border-2 border-amber-600"
          />
        )}
        <h1 className="text-4xl font-bold font-serif text-amber-400">{memo.symbol}</h1>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-amber-900">
        <h2 className="text-2xl font-semibold mb-4 font-serif text-amber-400 flex items-center">
          <Scroll className="mr-2" /> Arcane Inscriptions
        </h2>
        <p className="mb-2 font-serif"><strong className="text-amber-400">Offering:</strong> ${memo.priceUsd.toFixed(4)}</p>
        <p className="mb-2 font-serif"><strong className="text-amber-400">Ritual Pool:</strong> ${memo.liquidity.usd.toLocaleString()}</p>
        <p className="mb-2 font-serif"><strong className="text-amber-400">Daily Sacrifice:</strong> ${memo.volume.h24.toLocaleString()}</p>
        <p className="mb-2 font-mono text-sm"><strong className="text-amber-400">Sigil:</strong> {memo.tokenAddress}</p>
        <p className="mb-2 font-serif"><strong className="text-amber-400">True Name:</strong> {memo.name}</p>
      </div>

      {/* Add Event Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-amber-900">
        <h2 className="text-2xl font-semibold mb-4 font-serif text-amber-400 flex items-center">
          <Skull className="mr-2" /> Record New Ritual
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="timestamp" className="block text-amber-200 font-semibold mb-2 font-serif">
              Time of Invocation
            </label>
            <input
              type="datetime-local"
              id="timestamp"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-amber-900 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 text-amber-100"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-amber-200 font-semibold mb-2 font-serif">
              Ritual Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-amber-900 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 text-amber-100"
              rows={3}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="link" className="block text-amber-200 font-semibold mb-2 font-serif">
              Ethereal Link (optional)
            </label>
            <input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-amber-900 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 text-amber-100"
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

      {/* Events List */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-amber-900">
        <h2 className="text-2xl font-semibold mb-6 font-serif text-amber-400 flex items-center">
          <Scroll className="mr-2" /> Recorded Rituals
        </h2>
        {memo.events.length === 0 ? (
          <p className="text-amber-200 font-serif">The grimoire pages remain blank, awaiting the first inscription.</p>
        ) : (
          <ul className="space-y-8">
            {memo.events.map((event, index) => (
              <li key={index} className="bg-gray-900 p-6 rounded-lg shadow-inner border border-amber-800">
                <div className="flex items-center mb-4">
                  <Skull className="text-amber-500 mr-2" size={20} />
                  <p className="text-amber-300 font-mono text-sm">{new Date(event.timestamp).toLocaleString()}</p>
                </div>
                <p className="mb-4 font-serif text-amber-100">{event.description}</p>
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 hover:underline mb-4 inline-block font-serif flex items-center"
                  >
                    <Scroll className="mr-2" size={16} />
                    Ethereal Scroll
                  </a>
                )}

                {/* Large Transactions for this event */}
                {event.largeTransactions && event.largeTransactions.length > 0 && (
                  <div className="mt-6">
                    <button
                      onClick={() => toggleEventExpansion(index)}
                      className="bg-amber-700 text-black py-2 px-4 rounded-md font-bold hover:bg-amber-600 transition-colors mb-4 font-serif flex items-center"
                    >
                      <Coins className="mr-2" size={16} />
                      {expandedEvents.includes(index) ? 'Conceal' : 'Reveal'} Major Offerings
                    </button>
                    {expandedEvents.includes(index) && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-800 text-amber-100 border-collapse">
                          <thead>
                            <tr className="bg-gray-900">
                              <th className="py-2 px-4 border border-amber-900 font-serif">Devotee's Sigil</th>
                              <th className="py-2 px-4 border border-amber-900 font-serif">Offering (USD)</th>
                              <th className="py-2 px-4 border border-amber-900 font-serif">Token Quantity</th>
                              <th className="py-2 px-4 border border-amber-900 font-serif">Time of Offering</th>
                              <th className="py-2 px-4 border border-amber-900 font-serif">Ritual Hash</th>
                            </tr>
                          </thead>
                          <tbody>
                            {event.largeTransactions.map((tx: LargeTransaction, txIndex: number) => (
                              <tr key={txIndex} className={txIndex % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}>
                                <td className="py-2 px-4 border border-amber-900 font-mono text-amber-300">{tx.buyer_address.slice(0, 6)}...{tx.buyer_address.slice(-4)}</td>
                                <td className="py-2 px-4 border border-amber-900 font-serif">${tx.amount_usd.toFixed(2)}</td>
                                <td className="py-2 px-4 border border-amber-900 font-serif">{tx.token_bought_amount.toFixed(2)}</td>
                                <td className="py-2 px-4 border border-amber-900 font-mono text-amber-300">{new Date(tx.block_time).toLocaleString()}</td>
                                <td className="py-2 px-4 border border-amber-900 font-serif">
                                  <a
                                    href={`https://etherscan.io/tx/${tx.tx_hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-400 hover:text-amber-300 hover:underline"
                                  >
                                    {tx.tx_hash.slice(0, 6)}...{tx.tx_hash.slice(-4)}
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
