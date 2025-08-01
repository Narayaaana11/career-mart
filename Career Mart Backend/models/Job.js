const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    index: true 
  },
  company: { 
    type: String, 
    required: true,
    index: true 
  },
  location: { 
    type: String, 
    index: true 
  },
  type: { 
    type: String, 
    enum: ['Full-Time', 'Part-Time', 'Remote', 'Contract', 'Internship', 'Freelance', 'Temporary'],
    default: 'Full-Time',
    index: true 
  },
  postedDate: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  applyUrl: { 
    type: String, 
    required: true,
    unique: true 
  },
  description: { 
    type: String,
    maxlength: 1000 
  },
  tags: [String],
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  experience: {
    min: Number,
    max: Number,
    unit: { type: String, enum: ['years', 'months'], default: 'years' }
  },
  skills: [String],
  benefits: [String],
  sourceUrl: String, // URL where the job was scraped from
  scrapedAt: { 
    type: Date, 
    default: Date.now 
  },
  isActive: { 
    type: Boolean, 
    default: true,
    index: true 
  }
}, {
  timestamps: true
});

// Create compound index for efficient queries
jobSchema.index({ title: 1, company: 1, location: 1 });

// Create text index for search functionality
jobSchema.index({ 
  title: 'text', 
  company: 'text', 
  description: 'text', 
  tags: 'text',
  skills: 'text'
});

module.exports = mongoose.model('Job', jobSchema);