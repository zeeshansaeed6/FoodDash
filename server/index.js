// ============================================================
// FoodDash — Express Backend Server (Port 5000)
// ============================================================
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import locationRoutes from './routes/locations.js';
import restaurantRoutes from './routes/restaurants.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/user.js';
import reservationRoutes from './routes/reservations.js';
import driverRoutes from './routes/drivers.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'FoodDash Backend Server',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/ai', aiRoutes);

// 404 Fallback for API
app.use((req, res) => {
  res.status(404).json({ success: false, message: `API endpoint ${req.originalUrl} not found` });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 FoodDash Backend Server running at http://localhost:${PORT}`);
  console.log(`📍 Universal Location Engine: Active (Any city worldwide)`);
  console.log(`🔐 Authentication & OTP Gateway: Online`);
  console.log(`🛵 Live Order Tracking: Online`);
  console.log(`======================================================\n`);
});
