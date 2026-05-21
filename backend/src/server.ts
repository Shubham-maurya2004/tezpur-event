import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import liveScoreRoutes from './routes/liveScoreRoutes';
import uploadRoutes from './routes/uploadRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const allowedOrigins: string[] = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/livescores', liveScoreRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinEvent', (eventId: string) => {
    socket.join(`event_${eventId}`);
  });

  socket.on('leaveEvent', (eventId: string) => {
    socket.leave(`event_${eventId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
