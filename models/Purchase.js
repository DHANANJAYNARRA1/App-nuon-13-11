const mongoose = require('mongoose');


const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false
  },
  workshopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
    required: false
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: false
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'stripe', 'free'],
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// At least one of courseId, workshopId, or eventId must be present
purchaseSchema.pre('validate', function(next) {
  if (!this.courseId && !this.workshopId && !this.eventId) {
    return next(new Error('Either courseId, workshopId, or eventId is required'));
  }
  next();
});

// Compound indexes to prevent duplicate purchases for course or workshop
purchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true, partialFilterExpression: { courseId: { $exists: true, $ne: null } } });
purchaseSchema.index({ userId: 1, workshopId: 1 }, { unique: true, partialFilterExpression: { workshopId: { $exists: true, $ne: null } } });
purchaseSchema.index({ userId: 1, eventId: 1 }, { unique: true, partialFilterExpression: { eventId: { $exists: true, $ne: null } } });

module.exports = mongoose.model('Purchase', purchaseSchema);