import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import MemoForm from './components/MemoForm'
import MemoDetails from './components/MemoDetails'
import { getAllMemos } from './utils/memoApi'

interface Event {
  timestamp: string;
  description: string;
  link: string;
}

interface Memo {
  tokenAddress: string;
  events: Event[];
}

function App() {
  const [memos, setMemos] = useState<Record<string, Memo>>({})

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const fetchedMemos = await getAllMemos()
        const memosRecord: Record<string, Memo> = {}
        fetchedMemos.forEach(memo => {
          memosRecord[memo.tokenAddress] = memo
        })
        setMemos(memosRecord)
      } catch (error) {
        console.error('Error fetching memos:', error)
      }
    }

    fetchMemos()
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home memos={memos} />} />
            <Route path="/create" element={<MemoForm />} />
            <Route path="/memo/:tokenAddress" element={<MemoDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
