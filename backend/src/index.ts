import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import uploadRoutes from './routes/upload.routes';
import chatRoutes from './routes/chat.routes';
import authRoutes from './routes/auth.routes';
import documentsRoutes from './routes/document.routes';
import connectDB from './config/db.config';

const app: Application = express();

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/chat', chatRoutes);
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/documents', documentsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);