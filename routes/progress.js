const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { auth } = require('../middleware/auth');

// Get user progress (protected)
router.get('/progress/:userId', auth, progressController.getUserProgress);

// Update lesson progress (protected)
router.post('/progress/lesson', auth, progressController.updateLessonProgress);

// Get all user progress (admin) (protected)
router.get('/progress', auth, progressController.getAllUserProgress);

// Download certificate (protected)
router.get('/progress/:userId/certificate/:courseId', auth, progressController.downloadCertificate);

module.exports = router;