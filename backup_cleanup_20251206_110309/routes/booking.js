const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');

// Create booking (protected)
router.post('/booking', auth, bookingController.createBooking);

// Get user bookings (protected)
router.get('/booking', auth, bookingController.getBookings);

// Update booking status (protected)
router.put('/booking/:id/status', auth, bookingController.updateBookingStatus);

// Create Zoom session for booking (protected)
router.post('/booking/:id/zoom', auth, bookingController.createZoomSession);

module.exports = router;