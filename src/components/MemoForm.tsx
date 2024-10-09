import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface TokenInfo {
  name: string;
  symbol: string;
  priceUsd: string;
  liquidity: string;
  volume24h: string;
}

interface MemoFormProps {
  addMemo: (tokenAddress: string, tokenInfo: TokenInfo) => void
}

const MemoForm: React.FC<MemoFormProps> = ({ addMemo }) => {
  const [tokenAddress, setTokenAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchTokenInfo = async (address: string): Promise<TokenInfo | null> => {
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`)
      const data = await response.json()

      if (data.pairs && data.pairs.length > 0) {
        const pair = data.pairs[0]
        return {
          name: pair.baseToken.name,
          symbol: pair.baseToken.symbol,
          priceUsd: pair.priceUsd,
          liquidity: pair.liquidity.usd,
          volume24h: pair.volume.h24,
        }
      }
      return null
    } catch (error) {
      console.error('Error fetching token info:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (tokenAddress.trim()) {
      setIsLoading(true)
      setError('')
      const tokenInfo = await fetchTokenInfo(tokenAddress.trim())
      setIsLoading(false)

      if (tokenInfo) {
        addMemo(tokenAddress.trim(), tokenInfo)
        navigate(`/memo/${tokenAddress.trim()}`)
      } else {
        setError('Unable to fetch token information. Please check the address and try again.')
      }
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Memecoin Memo</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="tokenAddress" className="block text-gray-700 font-semibold mb-2">
            Token Address
          </label>
          <input
            type="text"
            id="tokenAddress"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter token address"
            required
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Create Memo'}
        </button>
      </form>
    </div>
  )
}

export default MemoForm