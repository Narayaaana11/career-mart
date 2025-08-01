const mongoose = require('mongoose');
     const userSchema = new mongoose.Schema({
       email: { type: String, required: true, unique: true },
       password: { type: String, required: false, default: 'no-password-required' },
       savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
       alerts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alert' }],
       recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
       compareJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
     });
     module.exports = mongoose.model('User', userSchema);