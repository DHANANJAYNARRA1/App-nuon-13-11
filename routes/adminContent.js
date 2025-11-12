const express = require('express');
const router = express.Router();
const adminContentController = require('../controllers/adminContentController');
const { auth } = require('../middleware/auth');
const { uploadSingle, uploadFile } = require('../controllers/uploadController');

// Upload endpoint for admin content
router.post('/upload', auth, (req, res, next) => {
  const fieldName = req.query.type || 'file';
  uploadSingle(fieldName)(req, res, next);
}, uploadFile);

// Workshop management (protected)
router.get('/workshops', auth, adminContentController.listWorkshops);
router.post('/workshops', auth, adminContentController.createWorkshop);
router.get('/workshops/:id', auth, adminContentController.getWorkshop);
router.put('/workshops/:id', auth, adminContentController.updateWorkshop);
router.delete('/workshops/:id', auth, adminContentController.deleteWorkshop);

// Session management (protected)
router.get('/sessions', auth, adminContentController.listSessions);
router.post('/sessions', auth, adminContentController.createSession);
router.get('/sessions/:id', auth, adminContentController.getSession);
router.put('/sessions/:id', auth, adminContentController.updateSession);
router.delete('/sessions/:id', auth, adminContentController.deleteSession);

module.exports = router;