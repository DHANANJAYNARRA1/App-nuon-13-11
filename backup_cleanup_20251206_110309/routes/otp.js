const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');


// Send OTP to phone number
router.post('/send/phone', otpController.sendPhoneOTP);

// Send OTP to email
router.post('/send/email', otpController.sendEmailOTP);

// Send OTP (unified endpoint for mobile app)
router.post('/send', otpController.sendPhoneOTP);

// Verify OTP
router.post('/verify', otpController.verifyOTP);

module.exports = router;