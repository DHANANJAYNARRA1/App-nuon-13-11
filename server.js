const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import centralized IP configuration
const { IP_ADDRESS } = require('./config/ipConfig');

const authRoutes = require('./routes/auth');
const otpRoutes = require('./routes/otp');
const catalogRoutes = require('./routes/catalog');
const bookingRoutes = require('./routes/booking');
const paymentRoutes = require('./routes/payment');
const assessmentRoutes = require('./routes/assessment');
const nccRoutes = require('./routes/ncc');
const feedbackRoutes = require('./routes/feedback');
const mentorRoutes = require('./routes/mentor');
const mentorBookingRoutes = require('./routes/mentorBooking');
const mobileRoutes = require('./routes/mobile');
const adminRoutes = require('./routes/admin');
const adminContentRoutes = require('./routes/adminContent');
const uploadRoutes = require('./routes/upload');
const courseRoutes = require('./routes/courses');
const eventRoutes = require('./routes/events');
const workshopRoutes = require('./routes/workshops');
const progressRoutes = require('./routes/progress');
const notificationRoutes = require('./routes/notification');
const newsRoutes = require('./routes/news');
const activitiesRoutes = require('./routes/activities');

const app = express();
// Serve the uploads folder as static so images/videos are accessible
app.use('/uploads', express.static('uploads'));
// Create HTTP server and attach socket.io
const http = require('http');
const server = http.createServer(app);
const { initializeSocket } = require('./lib/socket');
const io = initializeSocket(server);

// Middleware
// Configure CORS to allow frontend origins used during development.
// Add any dev hosts/ports your frontends run on (e.g. 3000, 5001, mobile emulators, etc.)
const allowedOrigins = [
  `http://localhost:3000`,
  `http://localhost:3001`,
  `http://localhost:3002`,
  `http://localhost:5000`,
  `http://192.168.0.116:3000`,
  `http://192.168.0.116:3001`,
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';

  console.log(`[CORS] Request from IP: ${clientIP}, Origin: ${origin || 'none'}, Method: ${req.method}, URL: ${req.originalUrl}`);

  if (!origin) {
    // Non-browser requests (curl, server-to-server) or same-origin
    console.log(`[CORS] Allowing non-browser request from IP: ${clientIP}`);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return next();
  }

  if (allowedOrigins.includes(origin)) {
    console.log(`[CORS] Allowing request from allowed origin: ${origin} (IP: ${clientIP})`);
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Handle preflight
    if (req.method === 'OPTIONS') {
      console.log(`[CORS] Handling preflight request from ${origin}`);
      return res.sendStatus(200);
    }
    return next();
  }

  // Log blocked requests for debugging
  console.log(`[CORS] BLOCKED: Origin ${origin} not in allowed list. IP: ${clientIP}, Allowed origins:`, allowedOrigins);
  res.status(403).json({ error: 'CORS policy: This origin is not allowed', clientIP, requestedOrigin: origin });
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to log incoming requests
// Enhanced request logger: logs every API operation with user info if available
app.use(async (req, res, next) => {
  let userInfo = '';
  try {
    // Try to extract user info from token if present
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      // Try to decode JWT (do not verify signature here, just decode for logging)
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        userInfo = payload.email ? ` | user: ${payload.email}` : '';
      }
    }
  } catch (e) {
    // ignore decode errors
  }
  const now = new Date().toISOString();
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
  console.log(`[${now}] [${req.method}] ${req.originalUrl}${userInfo} | IP: ${clientIP} | Body:`, req.body);
  next();
});

// Middleware to log all incoming requests with tokens and operation details
app.use((req, res, next) => {
  const token = req.headers['authorization'] || 'No Token';
  console.log(`[BACKEND LOG] ${req.method} ${req.originalUrl}`);
  console.log(`[BACKEND LOG] Token: ${token}`);
  console.log(`[BACKEND LOG] Body:`, req.body);
  next();
});

// Enable detailed logging for debugging
const fs = require('fs');
const logStream = fs.createWriteStream(path.join(__dirname, 'logs', 'server.log'), { flags: 'a' });
app.use((req, res, next) => {
  const logEntry = `${new Date().toISOString()} [${req.method}] ${req.originalUrl} | IP: ${req.ip}\n`;
  logStream.write(logEntry);
  console.log(logEntry);
  next();
});

// Test route (used by mobile app for connectivity probing)
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!', timestamp: new Date().toISOString() });
});

// Routes - Order matters! Specific routes before generic ones
app.use('/api', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api', catalogRoutes);
app.use('/api', bookingRoutes);
app.use('/api', paymentRoutes);
app.use('/api', assessmentRoutes);
app.use('/api', feedbackRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api', mentorBookingRoutes);
app.use('/api', mobileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminContentRoutes);
app.use('/api/admin', uploadRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api', notificationRoutes);
app.use('/api', nccRoutes); // NCC routes before news routes
// News routes last - the /:id route will catch everything else
app.use('/api', newsRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neonclub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tlsAllowInvalidCertificates: true,
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Connection details:', {
    uri: process.env.MONGODB_URI ? 'Atlas URI provided' : 'Local fallback',
    errorCode: err.code,
    errorName: err.name,
    message: err.message
  });
  process.exit(1);
});

// Ensure an admin user exists on startup. Uses ADMIN_EMAIL and ADMIN_PASSWORD env vars
// If not provided, falls back to admin@neonclub.com / admin123 (same as scripts/create-admin.js)
const ensureAdmin = async () => {
  try {
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');

    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('⏳ Database not ready yet, skipping admin user creation');
      return;
    }

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@neonclub.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('✅ Admin user exists:', adminEmail);
      return;
    }

    const hashed = await bcrypt.hash(adminPassword, 10);
    const admin = new User({ name: 'System Administrator', email: adminEmail, passwordHash: hashed, role: 'admin' });
    await admin.save();
    console.log('🎉 Admin user created:', adminEmail);
  } catch (err) {
    console.log('⚠️ Unable to ensure admin user:', err.message);
  }
};

// Run ensureAdmin after a small delay to allow mongoose connection to establish
setTimeout(ensureAdmin, 2000);

// Change the port to 5000 for testing
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server (with sockets) running on port ${PORT}`);
  try {
    const logger = require('./lib/logger');
    // list registered routes (one-time) to help diagnose missing endpoints
    const routes = [];
    (app._router && app._router.stack || []).forEach((r) => {
      if (r.route && r.route.path) {
        const methods = Object.keys(r.route.methods).join(',').toUpperCase();
        routes.push(`${methods} ${r.route.path}`);
      } else if (r.name === 'router' && r.handle && r.handle.stack) {
        r.handle.stack.forEach((s) => {
          if (s.route && s.route.path) {
            const methods = Object.keys(s.route.methods).join(',').toUpperCase();
            routes.push(`${methods} ${s.route.path}`);
          }
        });
      }
    });
    logger.info('[startup] registered routes:', routes.join(' | '));
  } catch (e) {
    console.error('route listing failed', e && e.message);
  }
});