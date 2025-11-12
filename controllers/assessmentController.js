const { Assessment, AssessmentAttempt } = require('../models/Assessment');

// Get assessments by type (course or NCC)
const getAssessments = async (req, res) => {
  try {
    const { type, courseId } = req.query;
    let filter = { isActive: true };

    if (type) filter.type = type;  // 'course' or 'ncc'
    if (courseId) filter.courseId = courseId;

    const assessments = await Assessment.find(filter)
      .populate('courseId', 'title type')
      .populate('createdBy', 'name')
      .select('-questions.correctAnswer');  // Hide correct answers

    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's assessment attempts
const getUserAttempts = async (req, res) => {
  try {
    const { userId } = req.query;
    const targetUserId = userId || req.user._id;

    const attempts = await AssessmentAttempt.find({ userId: targetUserId })
      .populate('assessmentId', 'title type')
      .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body;
    const assessmentId = req.params.id;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Check if user already attempted this assessment
    const existingAttempt = await AssessmentAttempt.findOne({
      assessmentId,
      userId: req.user._id
    });

    if (existingAttempt) {
      return res.status(400).json({ message: 'Assessment already attempted' });
    }

    // Calculate score
    let correctAnswers = 0;
    assessment.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / assessment.questions.length) * 100;
    const passed = score >= 70; // 70% passing grade

    // Create assessment attempt record
    const attempt = await AssessmentAttempt.create({
      assessmentId,
      userId: req.user._id,
      answers,
      score,
      passed
    });

    res.json({
      attemptId: attempt._id,
      score,
      passed,
      totalQuestions: assessment.questions.length,
      correctAnswers,
      assessmentType: assessment.type
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssessmentResult = async (req, res) => {
  try {
    const attemptId = req.params.id;

    const attempt = await AssessmentAttempt.findById(attemptId)
      .populate('assessmentId', 'title type')
      .populate('userId', 'name email');

    if (!attempt) {
      return res.status(404).json({ message: 'Assessment attempt not found' });
    }

    // Check if user can view this result
    if (attempt.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      attemptId: attempt._id,
      assessment: attempt.assessmentId,
      user: attempt.userId,
      score: attempt.score,
      passed: attempt.passed,
      submittedAt: attempt.submittedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAssessment = async (req, res) => {
  try {
    const { title, type, questions, courseId } = req.body;

    const assessment = await Assessment.create({
      title,
      type,  // 'course' or 'ncc'
      questions,
      courseId: type === 'course' ? courseId : undefined,
      createdBy: req.user._id
    });

    const populatedAssessment = await Assessment.findById(assessment._id)
      .populate('courseId', 'title type')
      .populate('createdBy', 'name');

    res.status(201).json(populatedAssessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAssessment = async (req, res) => {
  try {
    const { title, type, questions, courseId } = req.body;
    const assessmentId = req.params.id;

    const updatedAssessment = await Assessment.findByIdAndUpdate(
      assessmentId,
      {
        title,
        type,
        questions,
        courseId: type === 'course' ? courseId : undefined,
        updatedAt: new Date()
      },
      { new: true }
    )
    .populate('courseId', 'title type')
    .populate('createdBy', 'name');

    if (!updatedAssessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    res.json(updatedAssessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.id;

    const assessment = await Assessment.findByIdAndDelete(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Also delete all attempts for this assessment
    await AssessmentAttempt.deleteMany({ assessmentId });

    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAssessments,
  getUserAttempts,
  submitAssessment,
  getAssessmentResult,
  createAssessment,
  updateAssessment,
  deleteAssessment
};