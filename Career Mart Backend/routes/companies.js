const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

// Get all companies
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      industry, 
      featured, 
      location,
      page = 1, 
      limit = 50,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    if (industry && industry !== 'all') {
      filter.industry = industry;
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const companies = await Company.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    // Get total count for pagination
    const total = await Company.countDocuments(filter);

    res.json({
      companies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCompanies: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Error fetching companies', error: error.message });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).select('-__v');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ message: 'Error fetching company', error: error.message });
  }
});

// Create new company
router.post('/', async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Company with this name already exists' });
    }
    res.status(500).json({ message: 'Error creating company', error: error.message });
  }
});

// Update company
router.put('/:id', async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ message: 'Error updating company', error: error.message });
  }
});

// Delete company (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { isActive: false, lastUpdated: Date.now() },
      { new: true }
    );
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ message: 'Error deleting company', error: error.message });
  }
});

// Get companies by industry
router.get('/industry/:industry', async (req, res) => {
  try {
    const companies = await Company.find({ 
      industry: req.params.industry, 
      isActive: true 
    }).select('-__v');
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies by industry:', error);
    res.status(500).json({ message: 'Error fetching companies', error: error.message });
  }
});

// Get featured companies
router.get('/featured/all', async (req, res) => {
  try {
    const companies = await Company.find({ 
      featured: true, 
      isActive: true 
    }).select('-__v');
    res.json(companies);
  } catch (error) {
    console.error('Error fetching featured companies:', error);
    res.status(500).json({ message: 'Error fetching featured companies', error: error.message });
  }
});

// Get companies statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Company.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalCompanies: { $sum: 1 },
          totalOpenPositions: { $sum: '$openPositions' },
          averageRating: { $avg: '$rating' },
          featuredCompanies: { $sum: { $cond: ['$featured', 1, 0] } }
        }
      }
    ]);

    const industryStats = await Company.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$industry',
          count: { $sum: 1 },
          totalPositions: { $sum: '$openPositions' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      overview: stats[0] || {
        totalCompanies: 0,
        totalOpenPositions: 0,
        averageRating: 0,
        featuredCompanies: 0
      },
      topIndustries: industryStats
    });
  } catch (error) {
    console.error('Error fetching company statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

module.exports = router; 