import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getMemo, addEvent, deleteMemo, deleteEvent } from '../utils/memoApi'
import { Memo, Event, LargeTransaction } from '../types'
import { Skull, Scroll, Coins, Download, Trash2, ArrowLeft, Plus } from 'lucide-react'

const MemoDetails: React.FC = () => {
  const { tokenAddress } = useParams<{ tokenAddress: string }>()
  const navigate = useNavigate()
  const [memo, setMemo] = useState<Memo | null>(null)
  const [timestamp, setTimestamp] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [, setIsLoading] = useState(false)
  const [, setError] = useState('')
  const [expandedEvents, setExpandedEvents] = useState<number[]>([])
  const [showForm, setShowForm] = useState(false)
  const [startTime, setStartTime] = useState('')
  const [minAmountUsd, setMinAmountUsd] = useState('')
  const [showAquiverFields, setShowAquiverFields] = useState(false)

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
        const newEvent: Event = {
          timestamp: new Date(timestamp).toISOString(),
          description,
          link: link || '',
          _id: '',
          startTime: startTime ? new Date(startTime).toISOString() : undefined,
          minAmountUsd: minAmountUsd ? parseFloat(minAmountUsd) : undefined
        }
        const updatedMemo = await addEvent(tokenAddress, newEvent)
        setMemo(updatedMemo)
        setTimestamp('')
        setDescription('')
        setLink('')
        setStartTime('')
        setMinAmountUsd('')
        setShowAquiverFields(false)
        setShowForm(false)
      } catch (err) {
        setError('Failed to add event. Please try again.')
        console.error('Error adding event:', err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDeleteMemo = async () => {
    if (tokenAddress && window.confirm('Are you sure you want to delete this memo?')) {
      try {
        await deleteMemo(tokenAddress)
        navigate('/')
      } catch (err) {
        setError('Failed to delete memo. Please try again.')
        console.error('Error deleting memo:', err)
      }
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (tokenAddress && window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(tokenAddress, eventId);
        // 重新获取整个 memo
        const updatedMemo = await getMemo(tokenAddress);
        setMemo(updatedMemo);
      } catch (err) {
        console.error('Error deleting event:', err);
        setError('Failed to delete event. Please try again.');
      }
    }
  }

  const toggleEventExpansion = (index: number) => {
    setExpandedEvents(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const generateCSV = () => {
    if (!memo) return ''

    const headers = ['Timestamp', 'Description', 'Link']
    const rows = memo.events.map(event => [
      event.timestamp,
      event.description,
      event.link
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    return csvContent
  }


  const generateMajorOfferingsCSV = (transactions: LargeTransaction[]) => {
    const headers = ['Devotee\'s Sigil', 'Offering (USD)', 'Token Quantity', 'Time of Offering', 'Ritual Hash']
    const rows = transactions.map(tx => [
      tx.buyer_address,
      tx.amount_usd.toFixed(2),
      tx.token_bought_amount.toFixed(2),
      new Date(tx.block_time).toLocaleString(),
      tx.tx_hash
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    return csvContent
  }

  const downloadMajorOfferingsCSV = (transactions: LargeTransaction[], eventTimestamp: string) => {
    const csvContent = generateMajorOfferingsCSV(transactions)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${memo?.symbol}_major_offerings_${eventTimestamp}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (!memo) {
    return <div className="text-amber-100">Summoning the arcane knowledge...</div>
  }

  return (
    <div className="bg-gray-900 min-h-screen text-amber-100">
      {/* Navigation bar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <Link to="/" className="text-amber-400 hover:text-amber-300 flex items-center">
          <ArrowLeft className="mr-2" size={20} />
          Back to Grimoire
        </Link>
        <h1 className="text-2xl font-bold font-serif text-amber-400">{memo?.symbol || 'Loading...'}</h1>
        <div className="w-24"></div> {/* Placeholder for balance */}
      </nav>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column: Memo details and actions */}
          <div className="md:w-1/3">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-amber-900 mb-6">
              {/* 添加图片 */}
              {memo.imageUrl && (
                <div className="mb-4">
                  <img
                    src={memo.imageUrl}
                    alt={memo.name}
                    className="w-64 h-64 object-cover rounded-lg shadow-lg border border-amber-600 mx-auto mb-4"
                  />
                </div>
              )}
              {/* Memo details */}
              <h2 className="text-2xl font-semibold mb-4 font-serif text-amber-400 flex items-center">
                <Scroll className="mr-2" /> Arcane Inscriptions
              </h2>
              <p className="mb-2 font-serif"><strong className="text-amber-400">Offering:</strong> ${memo.priceUsd.toFixed(4)}</p>
              <p className="mb-2 font-serif"><strong className="text-amber-400">Ritual Pool:</strong> ${memo.liquidity.usd.toLocaleString()}</p>
              <p className="mb-2 font-serif"><strong className="text-amber-400">Daily Sacrifice:</strong> ${memo.volume.h24.toLocaleString()}</p>
              <p className="mb-2 font-mono text-sm"><strong className="text-amber-400">Sigil:</strong> {memo.tokenAddress}</p>
              <p className="mb-2 font-serif"><strong className="text-amber-400">True Name:</strong> {memo.name}</p>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={handleDeleteMemo}
                className="bg-amber-700 text-black py-2 px-4 rounded-md font-bold hover:bg-amber-600 transition-colors duration-300 flex items-center justify-center font-serif"
              >
                <Trash2 className="mr-2" size={16} />
                Erase Grimoire
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-amber-700 text-black py-2 px-4 rounded-md font-bold hover:bg-amber-600 transition-colors duration-300 flex items-center justify-center font-serif"
              >
                <Plus className="mr-2" size={16} />
                Inscribe New Ritual
              </button>
            </div>
          </div>

          {/* Right column: Events list */}
          <div className="md:w-2/3">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-amber-900">
              <h2 className="text-2xl font-semibold font-serif text-amber-400 flex items-center mb-6">
                <Scroll className="mr-2" /> Recorded Rituals
              </h2>
              {/* Events list */}
              {memo.events.length === 0 ? (
                <p className="text-amber-200 font-serif">The grimoire pages remain blank, awaiting the first inscription.</p>
              ) : (
                <ul className="space-y-8">
                  {memo.events.map((event, index) => (
                    <li key={index} className="bg-gray-900 p-6 rounded-lg shadow-inner border border-amber-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Skull className="text-amber-500 mr-2" size={20} />
                          <p className="text-amber-300 font-mono text-sm">{new Date(event.timestamp).toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="bg-amber-700 text-black py-2 px-4 rounded-md font-bold hover:bg-amber-600 transition-colors duration-300 flex items-center"
                        >
                          <Trash2 className="mr-2" size={16} />
                          Erase Ritual
                        </button>
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
                          <div className="flex justify-between items-center mb-4">
                            <button
                              onClick={() => toggleEventExpansion(index)}
                              className="bg-amber-700 text-black py-2 px-4 rounded-md font-bold hover:bg-amber-600 transition-colors font-serif flex items-center"
                            >
                              <Coins className="mr-2" size={16} />
                              {expandedEvents.includes(index) ? 'Conceal' : 'Reveal'} Major Offerings
                            </button>
                            <button
                              onClick={() => downloadMajorOfferingsCSV(event.largeTransactions, event.timestamp)}
                              className="bg-amber-700 text-black py-2 px-4 rounded-md font-bold hover:bg-amber-600 transition-colors duration-300 flex items-center font-serif"
                            >
                              <Download className="mr-2" size={16} />
                              Download
                            </button>
                          </div>
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
        </div>
      </div>

      {/* Modal for adding new event */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-amber-900 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4 font-serif text-amber-400 flex items-center">
              <Skull className="mr-2" /> Inscribe New Ritual
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="timestamp" className="block text-amber-200 font-semibold mb-2 font-serif">
                  Time of Invocation (UTC)
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
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowAquiverFields(!showAquiverFields)}
                  className="text-amber-400 hover:text-amber-300 underline"
                >
                  Aquiver
                </button>
              </div>
              {showAquiverFields && (
                <>
                  <div className="mb-4">
                    <label htmlFor="startTime" className="block text-amber-200 font-semibold mb-2 font-serif">
                      Start Time (UTC, optional)
                    </label>
                    <input
                      type="datetime-local"
                      id="startTime"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-amber-900 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 text-amber-100"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="minAmountUsd" className="block text-amber-200 font-semibold mb-2 font-serif">
                      Minimum Amount USD (optional)
                    </label>
                    <input
                      type="number"
                      id="minAmountUsd"
                      value={minAmountUsd}
                      onChange={(e) => setMinAmountUsd(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-amber-900 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 text-amber-100"
                      placeholder="1000"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="mr-2 bg-gray-700 text-amber-100 py-2 px-4 rounded-md font-bold hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-700 text-black py-2 px-4 rounded-md font-bold hover:bg-amber-600 transition-colors duration-300"
                >
                  Inscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemoDetails