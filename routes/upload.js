const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  uploadSingle,
  uploadMultiple,
  uploadFile,
  uploadMultipleFiles,
  deleteFile
} = require('../controllers/uploadController');

// Single file upload with dynamic field name handling
router.post('/upload', auth, (req, res, next) => {
  // Determine the field name from the request
  const fieldName = req.query.type || 'file';
  uploadSingle(fieldName)(req, res, next);
}, uploadFile);

// Allow unauthenticated uploads for profile images (temporary fix)
router.post('/upload-public', (req, res, next) => {
  const fieldName = req.query.type || 'file';
  uploadSingle(fieldName)(req, res, next);
}, uploadFile);

// Multiple files upload
router.post('/upload-multiple', auth, uploadMultiple('files'), uploadMultipleFiles);

// Delete file
router.delete('/upload/:filename', auth, deleteFile);

module.exports = router;