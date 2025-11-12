const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { auth } = require('../middleware/auth');

// Submit feedback (protected)
router.post('/feedback/:nurseId', auth, feedbackController.submitFeedback);

// Get feedback (protected)
router.get('/feedback', auth, feedbackController.getFeedback);

module.exports = router;