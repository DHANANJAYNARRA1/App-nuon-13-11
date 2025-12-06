const mongoose = require('mongoose');

const catalogItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['event', 'course', 'workshop', 'program', 'mentorship', 'ncc'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  schedule: {
    type: Date,
    required: true
  },
  contentUrl: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CatalogItem', catalogItemSchema);