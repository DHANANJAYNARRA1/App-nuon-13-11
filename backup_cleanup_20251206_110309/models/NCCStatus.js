const mongoose = require('mongoose');

const nccStatusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  assessmentPass: {
    type: Boolean,
    default: false
  },
  interviewDone: {
    type: Boolean,
    default: false
  },
  leadershipDone: {
    type: Boolean,
    default: false
  },
  finalStatus: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'failed'],
    default: 'not_started'
  },
  currentStep: {
    type: String,
    enum: ['assessment', 'interview', 'leadership', 'completed'],
    default: 'assessment'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NCCStatus', nccStatusSchema);