import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import MemoForm from './components/MemoForm'
import MemoDetails from './components/MemoDetails'

interface TokenInfo {
  name: string;
  symbol: string;
  priceUsd: string;
  liquidity: string;
  volume24h: string;
}

interface Memo {
  tokenInfo: TokenInfo;
  events: Array<{ time: string; content: string; link: string }>;
}

function App() {
  const [memos, setMemos] = useState<Record<string, Memo>>({})

  const addMemo = (tokenAddress: string, tokenInfo: TokenInfo) => {
    setMemos(prevMemos => ({
      ...prevMemos,
      [tokenAddress]: { tokenInfo, events: [] }
    }))
  }

  const addEvent = (tokenAddress: string, event: { time: string, content: string, link: string }) => {
    setMemos(prevMemos => ({
      ...prevMemos,
      [tokenAddress]: {
        ...prevMemos[tokenAddress],
        events: [...(prevMemos[tokenAddress]?.events || []), event]
      }
    }))
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home memos={memos} />} />
            <Route path="/create" element={<MemoForm addMemo={addMemo} />} />
            <Route path="/memo/:tokenAddress" element={<MemoDetails memos={memos} addEvent={addEvent} />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App