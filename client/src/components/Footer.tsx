import React from 'react';
import { Coins } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-amber-100 py-4 border-t border-amber-900">
            <div className="container mx-auto px-4 flex flex-col items-center">
                <p className="flex items-center mb-2">
                    <Coins className="mr-2" size={16} />
                    <span className="font-serif">Support the Cult</span>
                </p>
                <a
                    href="https://etherscan.io/address/0x06C5462B26970091EFEc68D81e6043a0e21979CA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-amber-400 hover:text-amber-300 transition-colors duration-300"
                >
                    0x06C5462B26970091EFEc68D81e6043a0e21979CA
                </a>
            </div>
        </footer>
    );
};

export default Footer;