const mongoose = require('mongoose');

const mentorAvailabilitySchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  startDateTime: {
    type: Date,
    required: true,
    index: true
  },
  endDateTime: {
    type: Date,
    required: true,
    index: true
  },
  duration: {
    type: Number, // Duration in minutes
    default: 60
  },
  maxBookings: {
    type: Number,
    default: 1 // How many users can book this slot
  },
  currentBookings: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0 // Price for this mentorship session
  },
  sessionType: {
    type: String,
    enum: ['one-on-one', 'group', 'workshop', 'consultation'],
    default: 'one-on-one'
  },
  meetingType: {
    type: String,
    enum: ['zoom', 'google-meet', 'teams', 'phone', 'in-person'],
    default: 'zoom'
  },
  meetingLink: {
    type: String,
    default: ''
  },
  specializations: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  bookings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    bookedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
mentorAvailabilitySchema.index({ mentorId: 1, startDateTime: 1 });
mentorAvailabilitySchema.index({ startDateTime: 1, endDateTime: 1 });
mentorAvailabilitySchema.index({ isActive: 1, startDateTime: 1 });

// Virtual to check if slot is available
mentorAvailabilitySchema.virtual('isAvailable').get(function() {
  return this.isActive && 
         this.currentBookings < this.maxBookings && 
         this.startDateTime > new Date();
});

// Virtual to get remaining slots
mentorAvailabilitySchema.virtual('remainingSlots').get(function() {
  return Math.max(0, this.maxBookings - this.currentBookings);
});

module.exports = mongoose.model('MentorAvailability', mentorAvailabilitySchema);