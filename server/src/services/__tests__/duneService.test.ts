import dotenv from 'dotenv';
import path from 'path';
import { DuneClient, QueryParameter } from "@duneanalytics/client-sdk";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const DUNE_API_KEY = process.env.DUNE_API_KEY;

if (!DUNE_API_KEY) {
    throw new Error('DUNE_API_KEY is not set in the environment variables');
}

const dune = new DuneClient(DUNE_API_KEY);

describe('Dune Analytics Service', () => {
    it('should fetch data from Dune Analytics', async () => {
        const QUERY_ID = 4139932; // Replace with your actual query ID
        const tokenAddress = '0x72e4f9f808c49a2a61de9c5896298920dc4eeea9'; // Example token address
        const startTime = '2024-10-01 00:00:00'; // Example start time
        const endTime = '2024-10-12 00:00:00'; // Example end time

        const query_parameters = [
            QueryParameter.text("END_TIME", endTime),
            QueryParameter.text("START_TIME", startTime),
            QueryParameter.text("TOKEN_ADDRESS", tokenAddress),
            QueryParameter.number("MIN_AMOUNT_USD", "1000"),
        ];

        const result = await dune.runQuery({
            queryId: QUERY_ID,
            query_parameters: query_parameters,
        });

        expect(result).toBeDefined();
        expect(result.result).toBeDefined();
        expect(Array.isArray(result.result?.rows)).toBe(true);

        if (result.result?.rows && result.result.rows.length > 0) {
            const firstRow = result.result.rows[0];
            expect(firstRow).toHaveProperty('amount_usd');
            expect(firstRow).toHaveProperty('block_time');
            expect(firstRow).toHaveProperty('buyer_address');
            expect(firstRow).toHaveProperty('token_bought_amount');
            expect(firstRow).toHaveProperty('tx_hash');
        }

        // Log only the first 5 rows for brevity
        if (result && result.result && result.result.rows) {
            console.log(result.result.rows.slice(0, 5));
        }
    }, 30000); // Increase timeout to 30 seconds as API calls might take longer
});
