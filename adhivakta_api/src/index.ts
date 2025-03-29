import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import connectDB from './config/database';
import errorHandler from './middlewares/errorHandler';
import caseRoutes from './routes/caseRoutes';

import documentRoutes from './routes/documentRoutes';
import clientRoutes from './routes/clientRoutes';

import notificationRoutes from './routes/notificationRoutes';
import calendarRoutes from './routes/calendarRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);

app.use('/api/documents', documentRoutes);
app.use('/api/clients', clientRoutes);

app.use('/api/notifications', notificationRoutes);
app.use('/api/calendar', calendarRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});