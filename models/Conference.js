const mongoose = require('mongoose');

const conferenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in hours
    required: true
  },
  venue: {
    name: String,
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  capacity: {
    type: Number,
    default: 0
  },
  registeredCount: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['conference', 'seminar', 'workshop', 'webinar'],
    default: 'seminar'
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  requirements: [{
    type: String
  }],
  expectations: [{
    type: String
  }],
  importantInfo: {
    arriveEarly: Number, // minutes
    idRequired: Boolean,
    dressCode: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Conference', conferenceSchema);
