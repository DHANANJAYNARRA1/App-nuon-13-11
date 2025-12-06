const express = require('express');
const router = express.Router();
const workshopController = require('../controllers/workshopController');
const { auth } = require('../middleware/auth');

// Admin routes (protected)
router.post('/', auth, workshopController.createWorkshop);
router.put('/:id', auth, workshopController.updateWorkshop);
router.delete('/:id', auth, workshopController.deleteWorkshop);

// Get all workshops (public)
router.get('/', workshopController.getAllWorkshops);

// Get workshop by ID (public)
router.get('/:id', workshopController.getWorkshopById);

// Register for workshop (protected)
router.post('/:id/register', auth, workshopController.registerForWorkshop);

// Get my workshops (protected)
router.get('/my/workshops', auth, workshopController.getMyWorkshops);

// Get workshop materials (protected)
router.get('/workshops/:id/materials', auth, workshopController.getWorkshopMaterials);

module.exports = router;