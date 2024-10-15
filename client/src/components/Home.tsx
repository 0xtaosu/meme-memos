import React from 'react'
import { Link } from 'react-router-dom'
import { Memo } from '../types'
import { Skull, Scroll, Book } from 'lucide-react'

interface HomeProps {
  memos: Memo[];
}

const Home: React.FC<HomeProps> = ({ memos }) => {
  return (
    <div className="bg-gray-900 min-h-screen text-amber-100">
      <header className="bg-gray-800 py-6 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold font-serif text-amber-400 flex items-center justify-center">
            <Book className="mr-4" size={36} />
            The Arcane Grimoire
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(memos) && memos.map((memo) => (
            <Link
              key={memo._id}
              to={`/memo/${memo.tokenAddress}`}
              className="block bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg border border-amber-900 transform hover:scale-105 transition-all duration-300 hover:shadow-amber-600/30 hover:border-amber-600"
            >
              <div className="flex items-center mb-4">
                {memo.imageUrl ? (
                  <img
                    src={memo.imageUrl}
                    alt={`${memo.symbol} sigil`}
                    className="w-16 h-16 mr-4 rounded-full border-2 border-amber-600"
                  />
                ) : (
                  <div className="w-16 h-16 mr-4 rounded-full border-2 border-amber-600 flex items-center justify-center bg-gray-700">
                    <Skull className="text-amber-400" size={32} />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold font-serif text-amber-400 mb-1">
                    {memo.symbol || 'Unknown Token'}
                  </h2>
                  <p className="text-xs font-mono text-amber-200">
                    {memo.tokenAddress.slice(0, 6)}...{memo.tokenAddress.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 bg-gray-800 p-3 rounded-lg">
                <p className="font-serif flex items-center text-amber-300">
                  <Scroll className="mr-2 text-amber-500" size={18} />
                  <span>Rituals:</span>
                </p>
                <span className="text-2xl font-bold text-amber-400">{memo.events.length}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
