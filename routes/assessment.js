const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { auth } = require('../middleware/auth');

// Get assessments (protected)
router.get('/assessments', auth, assessmentController.getAssessments);

// Get user's assessment attempts (protected)
router.get('/assessments/attempts', auth, assessmentController.getUserAttempts);

// Create assessment (protected, admin only)
router.post('/assessments', auth, assessmentController.createAssessment);

// Update assessment (protected, admin only)
router.put('/assessments/:id', auth, assessmentController.updateAssessment);

// Delete assessment (protected, admin only)
router.delete('/assessments/:id', auth, assessmentController.deleteAssessment);

// Submit assessment (protected)
router.post('/assessments/:id/submit', auth, assessmentController.submitAssessment);

// Get assessment result (protected)
router.get('/assessments/result/:id', auth, assessmentController.getAssessmentResult);

module.exports = router;