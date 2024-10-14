import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Skull } from 'lucide-react'

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-gray-900 text-amber-100 p-4 border-b border-amber-900">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold font-serif">
          <Skull size={32} className="text-amber-400" />
          <span className="text-amber-400">Memecoin Grimoire</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-amber-400 transition-colors duration-300">Home</Link>
            </li>
            <li>
              <Link to="/create" className="hover:text-amber-400 transition-colors duration-300">New Sigil</Link>
            </li>
            {isAuthenticated ? (
              <li>
                <button onClick={handleLogout} className="hover:text-amber-400 transition-colors duration-300">Logout</button>
              </li>
            ) : (
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors duration-300">Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
