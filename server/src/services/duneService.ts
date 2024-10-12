import { DuneClient, QueryParameter } from "@duneanalytics/client-sdk";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DUNE_API_KEY = process.env.DUNE_API_KEY;

if (!DUNE_API_KEY) {
    throw new Error('DUNE_API_KEY is not set in the environment variables');
}

const dune = new DuneClient(DUNE_API_KEY);

// Helper function to format date
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().replace('T', ' ').substr(0, 19);
};

export const fetchLargeTransactions = async (startTime: string, endTime: string, tokenAddress: string) => {
    console.log(`Fetching large transactions for token: ${tokenAddress}`);
    console.log(`Original time range: ${startTime} to ${endTime}`);

    const QUERY_ID = 4139932; // Replace with your actual query ID

    const formattedStartTime = formatDate(startTime);
    const formattedEndTime = formatDate(endTime);

    console.log(`Formatted time range: ${formattedStartTime} to ${formattedEndTime}`);

    const query_parameters = [
        QueryParameter.text("END_TIME", formattedEndTime),
        QueryParameter.text("START_TIME", formattedStartTime),
        QueryParameter.text("TOKEN_ADDRESS", tokenAddress),
        QueryParameter.number("MIN_AMOUNT_USD", "1000"),
    ];

    console.log('Query parameters:', JSON.stringify(query_parameters, null, 2));

    try {
        console.log(`Sending query to Dune Analytics (Query ID: ${QUERY_ID})...`);
        const result = await dune.runQuery({
            queryId: QUERY_ID,
            query_parameters: query_parameters,
        });

        console.log('Query execution completed.');

        if (result.result?.rows) {
            console.log(`Received ${result.result.rows.length} rows of data.`);
            const processedData = result.result.rows.map(row => ({
                amount_usd: row.amount_usd,
                block_time: row.block_time,
                buyer_address: row.buyer_address,
                token_bought_amount: row.token_bought_amount,
                tx_hash: row.tx_hash
            }));
            console.log('First row of processed data:', JSON.stringify(processedData[0], null, 2));
            return processedData;
        } else {
            console.log('No data returned from Dune Analytics');
            throw new Error('No data returned from Dune Analytics');
        }
    } catch (error) {
        console.error('Error fetching large transactions:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
        }
        throw error;
    }
};