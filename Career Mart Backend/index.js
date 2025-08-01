const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

console.log('Starting Career Mart Backend Server...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', port);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/career-mart';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Continuing without database connection - scraping will still work but jobs won\'t be saved');
  });

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

// Routes
try {
  const jobRoutes = require('./routes/jobs');
  const scrapeRoutes = require('./routes/scrape');
  const alertRoutes = require('./routes/alerts');
  const userRoutes = require('./routes/users');
  const companyRoutes = require('./routes/companies');

  app.use('/api/jobs', jobRoutes);
  app.use('/api/scrape-jobs', scrapeRoutes);
  app.use('/api/alerts', alertRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/companies', companyRoutes);
} catch (error) {
  console.error('Error loading routes:', error);
  process.exit(1);
}

// Basic Route
app.get('/', (req, res) => {
  res.send('Career Mart API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API available at: http://localhost:${port}`);
});