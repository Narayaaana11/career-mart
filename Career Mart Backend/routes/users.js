const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new user (register) - Simplified without password
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({ email, password: 'no-password-required' });
    const newUser = await user.save();
    
    // Return user without password
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save job to user's saved jobs
router.post('/:id/save-job', async (req, res) => {
  try {
    const { jobId } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }
    
    res.json({ message: 'Job saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove job from user's saved jobs
router.delete('/:id/save-job/:jobId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.savedJobs = user.savedJobs.filter(id => id.toString() !== req.params.jobId);
    await user.save();
    
    res.json({ message: 'Job removed from saved jobs' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's saved jobs
router.get('/:id/saved-jobs', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('savedJobs');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add job to recently viewed
router.post('/:id/view-job', async (req, res) => {
  try {
    const { jobId } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove if already exists and add to front
    user.recentlyViewed = user.recentlyViewed.filter(id => id.toString() !== jobId);
    user.recentlyViewed.unshift(jobId);
    
    // Keep only last 10 recently viewed
    if (user.recentlyViewed.length > 10) {
      user.recentlyViewed = user.recentlyViewed.slice(0, 10);
    }
    
    await user.save();
    res.json({ message: 'Job added to recently viewed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's recently viewed jobs
router.get('/:id/recently-viewed', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('recentlyViewed');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.recentlyViewed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add job to compare list
router.post('/:id/compare-job', async (req, res) => {
  try {
    const { jobId } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.compareJobs.includes(jobId)) {
      user.compareJobs.push(jobId);
      await user.save();
    }
    
    res.json({ message: 'Job added to compare list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove job from compare list
router.delete('/:id/compare-job/:jobId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.compareJobs = user.compareJobs.filter(id => id.toString() !== req.params.jobId);
    await user.save();
    
    res.json({ message: 'Job removed from compare list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's compare jobs
router.get('/:id/compare-jobs', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('compareJobs');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.compareJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 