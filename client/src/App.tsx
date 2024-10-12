import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import MemoForm from './components/MemoForm'
import MemoDetails from './components/MemoDetails'
import { getAllMemos } from './utils/memoApi'
import { Memo } from './types'

function App() {
  const [memos, setMemos] = useState<Memo[]>([]);

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const fetchedMemos = await getAllMemos();
        setMemos(fetchedMemos);
      } catch (error) {
        console.error('Error fetching memos:', error);
        setMemos([]);
      }
    };

    fetchMemos();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home memos={memos} />} />
            <Route path="/create" element={<MemoForm />} />
            <Route path="/memo/:tokenAddress" element={<MemoDetails />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
