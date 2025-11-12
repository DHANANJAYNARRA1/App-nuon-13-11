const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth } = require('../middleware/auth');

// Create notification (protected)
router.post('/notification', auth, notificationController.createNotification);

// List notifications (protected)
router.get('/notification', auth, notificationController.listNotifications);

module.exports = router;