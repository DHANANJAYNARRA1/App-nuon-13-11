const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nurseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comments: {
    type: String,
    required: true
  },
  skills: {
    communication: Number,
    technical: Number,
    professionalism: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);