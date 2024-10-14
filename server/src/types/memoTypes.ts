// 定义 Event 接口
export interface Event {
    _id: string;
    timestamp: Date;
    description: string;
    link?: string;
    largeTransactions?: any[];
}

// 定义 Memo 接口
export interface Memo {
    tokenAddress: string;
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
    events: Event[];
}
