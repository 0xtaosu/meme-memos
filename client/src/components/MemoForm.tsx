import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMemo } from '../utils/memoApi'
import { Skull } from 'lucide-react'

interface TokenInfo {
  name: string;
  symbol: string;
  priceUsd: string;
  liquidity: string;
  volume24h: string;
}

const MemoForm: React.FC = () => {
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
      try {
        const tokenInfo = await fetchTokenInfo(tokenAddress.trim())

        if (tokenInfo) {
          await createMemo(tokenAddress.trim())
          navigate(`/memo/${tokenAddress.trim()}`)
        } else {
          setError('The sigil is unrecognized. Verify the inscription and attempt the ritual anew.')
        }
      } catch (error) {
        console.error('Error creating memo:', error)
        setError('A dark force intervenes. The ritual must be attempted again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 text-amber-100 rounded-lg shadow-lg border border-amber-900">
      <h1 className="text-3xl font-bold mb-6 text-amber-400 font-serif flex items-center">
        <Skull size={32} className="mr-2" />
        Inscribe New Sigil
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tokenAddress" className="block text-amber-200 font-semibold mb-2 font-serif">
            Token Sigil
          </label>
          <input
            type="text"
            id="tokenAddress"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-amber-900 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 text-amber-100"
            placeholder="Inscribe the mystical address"
            required
          />
        </div>
        {error && <p className="text-red-500 font-serif">{error}</p>}
        <button
          type="submit"
          className="w-full bg-amber-700 text-black py-2 px-4 rounded-md font-bold hover:bg-amber-600 transition-colors duration-300 font-serif"
          disabled={isLoading}
        >
          {isLoading ? 'Channeling energies...' : 'Perform Ritual'}
        </button>
      </form>
    </div>
  )
}

export default MemoForm
