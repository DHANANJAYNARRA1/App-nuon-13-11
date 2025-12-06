const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');
const { auth } = require('../middleware/auth');

// Get all catalog items
router.get('/catalog', catalogController.getCatalog);

// Create new catalog item (protected)
router.post('/catalog', auth, catalogController.createCatalogItem);

// Update catalog item (protected)
router.put('/catalog/:id', auth, catalogController.updateCatalogItem);

// Delete catalog item (protected)
router.delete('/catalog/:id', auth, catalogController.deleteCatalogItem);

module.exports = router;