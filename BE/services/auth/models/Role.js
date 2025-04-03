const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên vai trò là bắt buộc'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  permissions: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware pre-save để tự động cập nhật trường updatedAt
roleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Role', roleSchema); 