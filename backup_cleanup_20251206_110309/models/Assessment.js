const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['course', 'ncc'],  // Two types: course assessment or NCC assessment
    required: true
  },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String
  }],
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CatalogItem',
    required: function() {
      return this.type === 'course';  // Required only for course assessments
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true  // Admin who created the assessment
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Separate schema for user assessment attempts
const assessmentAttemptSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [String],
  score: Number,
  passed: Boolean,
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Assessment = mongoose.model('Assessment', assessmentSchema);
const AssessmentAttempt = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);

module.exports = { Assessment, AssessmentAttempt };