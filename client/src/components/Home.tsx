import React from 'react'
import { Link } from 'react-router-dom'
import { Memo } from '../types'

interface HomeProps {
  memos: Memo[];
}

const Home: React.FC<HomeProps> = ({ memos }) => {
  return (
    <div className="bg-black min-h-screen text-amber-100 p-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(memos) && memos.map((memo) => (
            <div key={memo._id} className="bg-gradient-to-b from-gray-900 to-gray-800 p-6 rounded-lg shadow-lg border border-amber-900 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-4">
                {memo.imageUrl && (
                  <img
                    src={memo.imageUrl}
                    alt={`${memo.symbol} sigil`}
                    className="w-16 h-16 mr-4 rounded-full border-2 border-amber-600"
                  />
                )}
                <h2 className="text-2xl font-bold font-serif text-amber-400">
                  {memo.symbol || 'Unknown Token'}
                </h2>
              </div>
              <p className="mb-2 text-amber-200 font-mono text-sm">
                <span className="font-medium">Sigil:</span> {memo.tokenAddress.slice(0, 6)}...{memo.tokenAddress.slice(-4)}
              </p>
              <p className="mb-2 font-serif">
                <span className="font-medium text-amber-400">Rituals:</span> {memo.events.length}
              </p>
              <p className="mb-2 font-serif">
                <span className="font-medium text-amber-400">Offering:</span> ${memo.priceUsd.toFixed(4)}
              </p>
              <p className="mb-4 font-serif">
                <span className="font-medium text-amber-400">Daily Sacrifice:</span> ${memo.volume.h24.toLocaleString()}
              </p>
              <Link
                to={`/memo/${memo.tokenAddress}`}
                className="inline-block bg-amber-700 text-black py-2 px-4 rounded font-bold hover:bg-amber-600 transition-colors duration-300"
              >
                Delve Deeper →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
