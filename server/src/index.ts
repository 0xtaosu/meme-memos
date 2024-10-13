import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import duneRoutes from './routes/duneRoutes';
import path from 'path';
import memoRoutes from './routes/memoRoutes';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: ["https://api.memegrimoire.xyz", 'https://www.memegrimoire.xyz', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode}`);
    });
    next();
});

app.use('/api/dune', duneRoutes);
app.use('/api/memos', memoRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
