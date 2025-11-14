const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const app = express();

// CORS Middleware - Allow requests from React Native app
app.use(cors({
  origin: '*', // Allow all origins (for development)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parser Middleware
// This allows us to accept JSON data in req.body
app.use(express.json());

const PORT = process.env.PORT || 5000;

// --- Test Route ---
app.get('/', (req, res) => {
  res.send('CropGuard AI Backend is running...');
});

// --- API Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/detect', require('./routes/detectionRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));


// --- Server Startup ---
// Listen on all network interfaces (0.0.0.0) to accept connections from mobile devices
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`Access from mobile: http://10.10.1.195:${PORT} or http://192.168.1.7:${PORT}`);
});