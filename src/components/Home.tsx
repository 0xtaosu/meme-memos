import React from 'react'
import { Link } from 'react-router-dom'

interface Memo {
  tokenInfo: {
    name: string;
    symbol: string;
    priceUsd: string;
  };
  events: Array<any>;
}

interface HomeProps {
  memos: Record<string, Memo>
}

const Home: React.FC<HomeProps> = ({ memos }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Memecoin Memos</h1>
      {Object.keys(memos).length === 0 ? (
        <p className="text-gray-600">No memos created yet. Create your first memo!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(memos).map(([tokenAddress, memo]) => (
            <Link
              key={tokenAddress}
              to={`/memo/${tokenAddress}`}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{memo.tokenInfo.name} ({memo.tokenInfo.symbol})</h2>
              <p className="text-gray-600 mb-2">Price: ${parseFloat(memo.tokenInfo.priceUsd).toFixed(6)}</p>
              <p className="text-gray-600">{memo.events.length} events</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home