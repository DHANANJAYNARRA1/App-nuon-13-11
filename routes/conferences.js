const express = require('express');
const router = express.Router();
const conferenceController = require('../controllers/conferenceController');
const { auth } = require('../middleware/auth');

// Admin routes (protected)
router.post('/', auth, conferenceController.createConference);
router.put('/:id', auth, conferenceController.updateConference);
router.delete('/:id', auth, conferenceController.deleteConference);

// Get all conferences (public)
router.get('/', conferenceController.getAllConferences);

// Get conference by ID (public)
router.get('/:id', conferenceController.getConferenceById);

// Register for conference (protected)
router.post('/:id/register', auth, conferenceController.registerForConference);

// Get my conferences (protected)
router.get('/my', auth, conferenceController.getMyConferences);
// Alias for mobile app compatibility
router.get('/my/conferences', auth, conferenceController.getMyConferences);

module.exports = router;
