const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  logo: { 
    type: String, 
    default: null 
  },
  description: { 
    type: String, 
    required: true 
  },
  industry: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  headquarters: {
    city: String,
    country: String,
    address: String
  },
  careerUrl: { 
    type: String, 
    required: true 
  },
  website: { 
    type: String 
  },
  openPositions: { 
    type: Number, 
    default: 0 
  },
  rating: { 
    type: Number, 
    min: 0, 
    max: 5, 
    default: 0 
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  founded: { 
    type: Number 
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+']
  },
  revenue: {
    type: String,
    enum: ['Under $1M', '$1M-$10M', '$10M-$50M', '$50M-$100M', '$100M-$500M', '$500M-$1B', '$1B+']
  },
  funding: {
    type: String,
    enum: ['Bootstrapped', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'Public', 'Acquired']
  },
  benefits: [String],
  technologies: [String],
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  contact: {
    email: String,
    phone: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better search performance
companySchema.index({ name: 'text', description: 'text', industry: 'text' });

module.exports = mongoose.model('Company', companySchema); 