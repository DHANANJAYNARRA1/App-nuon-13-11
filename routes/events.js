const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { auth } = require('../middleware/auth');

// Admin routes (protected)
router.post('/', auth, eventController.createEvent);
router.put('/:id', auth, eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);

// Get all events (public)
router.get('/', eventController.getAllEvents);

// Get event by ID (public)
router.get('/:id', eventController.getEventById);

// Register for event (protected)
router.post('/:id/register', auth, eventController.registerForEvent);

// Get my events (protected)
router.get('/my', auth, eventController.getMyEvents);
// Alias for mobile app compatibility
router.get('/my/events', auth, eventController.getMyEvents);

module.exports = router;