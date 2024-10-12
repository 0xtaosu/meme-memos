import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import duneRoutes from './routes/duneRoutes';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/dune', duneRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
