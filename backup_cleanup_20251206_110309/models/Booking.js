const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  nurseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Optional - only for mentorship bookings
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CatalogItem',
    required: false
  },
  availabilitySlotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorAvailability',
    required: false  // Only for mentor slot bookings
  },
  dateTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // Duration in minutes
    default: 60
  },
  sessionType: {
    type: String,
    enum: ['course', 'workshop', 'event', 'mentorship', 'consultation'],
    default: 'course'
  },
  price: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  zoomLink: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ nurseId: 1, dateTime: -1 });
bookingSchema.index({ mentorId: 1, dateTime: -1 });
bookingSchema.index({ status: 1, dateTime: 1 });

module.exports = mongoose.model('Booking', bookingSchema);