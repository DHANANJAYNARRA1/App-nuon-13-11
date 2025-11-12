const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Authentication routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// Direct endpoints for mobile onboarding
router.post('/register', authController.register);
router.post('/login', authController.login);

// Add route for mentor login
router.post('/mentor/login', authController.mentorLogin);

// Profile routes (protected)
router.get('/profile/:id', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.post('/profile', auth, authController.createOrUpdateProfile);

module.exports = router;