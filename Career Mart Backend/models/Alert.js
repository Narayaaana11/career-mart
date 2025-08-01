const mongoose = require('mongoose');
     const alertSchema = new mongoose.Schema({
       userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
       keyword: { type: String, required: true },
       location: String,
       type: { type: String, default: 'all' },
       frequency: { type: String, enum: ['immediate', 'daily', 'weekly'], default: 'daily' },
       active: { type: Boolean, default: true },
       createdAt: { type: Date, default: Date.now }
     });
     module.exports = mongoose.model('Alert', alertSchema);