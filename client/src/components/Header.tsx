import React from 'react'
import { Link } from 'react-router-dom'
import { Skull } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 text-amber-100 p-4 border-b border-amber-900">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold font-serif">
          <Skull size={32} className="text-amber-400" />
          <span className="text-amber-400">Memecoin Grimoire</span>
        </Link>
        <nav>
          <Link
            to="/create"
            className="bg-amber-700 text-black px-4 py-2 rounded-md font-bold hover:bg-amber-600 transition-colors duration-300 font-serif"
          >
            Inscribe New Sigil
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
