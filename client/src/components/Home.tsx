import React from 'react'
import { Link } from 'react-router-dom'

interface Event {
  timestamp: string;
  description: string;
  link: string;
}

interface Memo {
  tokenAddress: string;
  events: Event[];
}

interface HomeProps {
  memos: Record<string, Memo>;
}

const Home: React.FC<HomeProps> = ({ memos }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Memecoin Memos</h1>
      <Link to="/create" className="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors mb-6 inline-block">
        Create New Memo
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {Object.entries(memos).map(([tokenAddress, memo]) => (
          <div key={tokenAddress} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Token: {tokenAddress}</h2>
            <p className="mb-2">Events: {memo.events.length}</p>
            <Link to={`/memo/${tokenAddress}`} className="text-blue-600 hover:underline">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
