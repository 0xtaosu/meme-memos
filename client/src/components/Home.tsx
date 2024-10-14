import React from 'react'
import { Link } from 'react-router-dom'
import { Memo } from '../types'
import { Skull, Scroll, DollarSign, TrendingUp } from 'lucide-react'

interface HomeProps {
  memos: Memo[];
}

const Home: React.FC<HomeProps> = ({ memos }) => {
  return (
    <div className="bg-gray-900 min-h-screen text-amber-100">

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(memos) && memos.map((memo) => (
            <div key={memo._id} className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg border border-amber-900 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {memo.imageUrl ? (
                    <img
                      src={memo.imageUrl}
                      alt={`${memo.symbol} sigil`}
                      className="w-12 h-12 mr-3 rounded-full border-2 border-amber-600"
                    />
                  ) : (
                    <div className="w-12 h-12 mr-3 rounded-full border-2 border-amber-600 flex items-center justify-center bg-gray-700">
                      <Skull className="text-amber-400" size={24} />
                    </div>
                  )}
                  <h2 className="text-2xl font-bold font-serif text-amber-400">
                    {memo.symbol || 'Unknown Token'}
                  </h2>
                </div>
                <span className="text-xs font-mono bg-amber-800 text-black px-2 py-1 rounded">
                  {memo.tokenAddress.slice(0, 6)}...{memo.tokenAddress.slice(-4)}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <p className="font-serif flex items-center">
                  <Scroll className="mr-2 text-amber-500" size={16} />
                  <span className="text-amber-300">Rituals:</span> {memo.events.length}
                </p>
                <p className="font-serif flex items-center">
                  <DollarSign className="mr-2 text-amber-500" size={16} />
                  <span className="text-amber-300">Offering:</span> ${memo.priceUsd.toFixed(4)}
                </p>
                <p className="font-serif flex items-center">
                  <TrendingUp className="mr-2 text-amber-500" size={16} />
                  <span className="text-amber-300">Daily Sacrifice:</span> ${memo.volume.h24.toLocaleString()}
                </p>
              </div>
              <Link
                to={`/memo/${memo.tokenAddress}`}
                className="block w-full text-center bg-amber-700 text-black py-2 px-4 rounded font-bold hover:bg-amber-600 transition-colors duration-300"
              >
                Delve Deeper →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
