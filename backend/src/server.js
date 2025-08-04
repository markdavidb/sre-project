import express from 'express';
import cors from 'cors';            // 👉 import cors
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// 👇 Allow requests from your frontend origin
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true               // if you ever send cookies or auth headers
}));

app.use(express.json());
app.use('/auth', authRoutes);
app.get('/', (_, res) => res.send('API Running'));

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
