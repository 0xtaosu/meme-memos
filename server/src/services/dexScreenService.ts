import axios from 'axios';

interface TokenInfo {
    name: string;
    symbol: string;
    priceUsd: number;
    liquidity: {
        usd: number;
    };
    volume: {
        h24: number;
    };
    imageUrl?: string;
}

export async function fetchTokenInfo(tokenAddress: string): Promise<TokenInfo | null> {
    try {
        const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
        const pairs = response.data.pairs;

        if (!pairs || pairs.length === 0) {
            console.log('No pairs found for the given token address');
            return null;
        }

        // Find the pair with the highest liquidity
        const bestPair = pairs.reduce((best: any, current: any) => {
            const bestLiquidity = best.liquidity?.usd || 0;
            const currentLiquidity = current.liquidity?.usd || 0;
            return currentLiquidity > bestLiquidity ? current : best;
        });

        return {
            name: bestPair.baseToken.name,
            symbol: bestPair.baseToken.symbol,
            priceUsd: parseFloat(bestPair.priceUsd) || 0,
            liquidity: {
                usd: bestPair.liquidity?.usd || 0,
            },
            volume: {
                h24: bestPair.volume?.h24 || 0,
            },
            imageUrl: bestPair.info?.imageUrl,
        };
    } catch (error) {
        console.error('Error fetching token info from DexScreener:', error);
        return null;
    }
}