// 定义 Event 接口
export interface Event {
    timestamp: Date;
    description: string;
    link?: string;
    largeTransactions?: any[]; // 这里的类型可能需要根据实际数据结构进行调整
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