import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Skull } from 'lucide-react';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials. The spirits reject your offering.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-gray-900 text-amber-100 rounded-lg shadow-lg border border-amber-900">
            <h1 className="text-3xl font-bold mb-6 text-amber-400 font-serif flex items-center">
                <Skull size={32} className="mr-2" />
                Arcane Login
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-amber-200 font-semibold mb-2 font-serif">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-amber-900 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 text-amber-100"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-amber-200 font-semibold mb-2 font-serif">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-amber-900 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 text-amber-100"
                        required
                    />
                </div>
                {error && <p className="text-red-500 font-serif">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-amber-700 text-black py-2 px-4 rounded-md font-bold hover:bg-amber-600 transition-colors duration-300 font-serif"
                >
                    Enter the Realm
                </button>
            </form>
        </div>
    );
};

export default Login;