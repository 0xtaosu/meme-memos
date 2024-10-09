import React from 'react'
import { Link } from 'react-router-dom'
import { Coins } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
          <Coins size={32} />
          <span>Memecoin Memo</span>
        </Link>
        <nav>
          <Link to="/create" className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-100 transition-colors">
            Create Memo
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header