const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

// Initiate payment (protected)
router.post('/payment', auth, paymentController.initiatePayment);

// Initiate mentorship payment (protected)
router.post('/mentorship-payment', auth, paymentController.initiateMentorshipPayment);

// Get payment history (protected)
router.get('/payment/history', auth, paymentController.getPaymentHistory);

// Update payment status (protected)
router.put('/payment/:id/status', auth, paymentController.updatePaymentStatus);

module.exports = router;