const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const User = require('../models/User');

// Get all alerts for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.params.userId });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all alerts (admin only)
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().populate('userId', 'email');
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single alert by ID
router.get('/:id', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id).populate('userId', 'email');
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new alert
router.post('/', async (req, res) => {
  try {
    const { userId, keyword, location, type, frequency } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if similar alert already exists for this user
    const existingAlert = await Alert.findOne({
      userId,
      keyword,
      location,
      type
    });
    
    if (existingAlert) {
      return res.status(400).json({ message: 'Similar alert already exists' });
    }
    
    const alert = new Alert({
      userId,
      keyword,
      location,
      type,
      frequency
    });
    
    const newAlert = await alert.save();
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an alert
router.put('/:id', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an alert
router.delete('/:id', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle alert active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    alert.active = !alert.active;
    await alert.save();
    
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active alerts for a user
router.get('/user/:userId/active', async (req, res) => {
  try {
    const alerts = await Alert.find({ 
      userId: req.params.userId, 
      active: true 
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update alert frequency
router.patch('/:id/frequency', async (req, res) => {
  try {
    const { frequency } = req.body;
    const alert = await Alert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    alert.frequency = frequency;
    await alert.save();
    
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 