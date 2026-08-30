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
import paymentRoutes from './routes/payments.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});
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
app.use('/api/payments', paymentRoutes);

// 404 Fallback for API
app.use((req, res) => {
  res.status(404).json({ success: false, message: `API endpoint ${req.originalUrl} not found` });
});

// WebSockets Logic
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // When client joins an order tracking room
  socket.on('join_order_room', (orderId) => {
    socket.join(orderId);
    console.log(`[Socket.io] ${socket.id} joined room ${orderId}`);

    // Start a mock simulation loop for this order
    let distance = 3.5;
    let eta = 15;
    const simInterval = setInterval(() => {
      if (distance <= 0) {
        clearInterval(simInterval);
        io.to(orderId).emit('driver_location_update', {
          status: 'delivered',
          distanceRemainingKm: 0,
          etaMins: 0,
          speedKmh: 0,
          lat: 12.9279,
          lng: 77.6271
        });
        return;
      }
      
      distance -= 0.1;
      eta = Math.max(1, Math.floor(distance * 4));
      
      io.to(orderId).emit('driver_location_update', {
        status: distance < 0.5 ? 'arriving' : 'on_the_way',
        distanceRemainingKm: distance.toFixed(1),
        etaMins: eta,
        speedKmh: Math.floor(Math.random() * 20) + 20, // 20-40 km/h
        lat: 12.9352 - (3.5 - distance) * 0.002,
        lng: 77.6245 + (3.5 - distance) * 0.001
      });
    }, 3000);

    socket.on('disconnect', () => {
      clearInterval(simInterval);
    });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 FoodDash Backend Server running at http://localhost:${PORT}`);
    console.log(`📍 Universal Location Engine: Active (Any city worldwide)`);
    console.log(`🔐 Authentication & OTP Gateway: Online`);
    console.log(`📡 WebSocket / Socket.io Engine: Online`);
    console.log(`======================================================\n`);
  });
}

export { app, httpServer };
