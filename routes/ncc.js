const express = require('express');
const router = express.Router();
const nccController = require('../controllers/nccController');
const { auth } = require('../middleware/auth');

// Get NCC status (protected)
router.get('/status', auth, nccController.getNccStatus);

// Update NCC step (protected)
router.put('/step', auth, nccController.updateNccStep);

// Public NCC info endpoint
router.get('/ncc', nccController.getNccInfo);

module.exports = router;