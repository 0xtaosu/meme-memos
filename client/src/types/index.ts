export interface LargeTransaction {
    amount_usd: number;
    block_time: string;
    buyer_address: string;
    token_bought_amount: number;
    tx_hash: string;
}

export interface Event {
    _id: string;
    timestamp: string;
    description: string;
    link?: string;  // 使用可选属性
    largeTransactions?: LargeTransaction[];
}

export interface Memo {
    _id: string;
    tokenAddress: string;
    events: Event[];
    imageUrl: string;
    lastUpdated: string;
    liquidity: {
        usd: number;
    };
    name: string;
    priceUsd: number;
    symbol: string;
    volume: {
        h24: number;
    };
}
