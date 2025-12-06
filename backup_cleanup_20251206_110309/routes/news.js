const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { auth } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/latest', newsController.getLatestNews);
router.get('/featured', newsController.getFeaturedNews);

// Admin routes (authentication required)
router.get('/admin/stats', auth, newsController.getNewsStats);
router.get('/admin/all', auth, newsController.getAllNews);
router.post('/admin/create', auth, newsController.createNews);
router.put('/admin/:id', auth, newsController.updateNews);
router.patch('/admin/:id/publish', auth, newsController.publishNews);
router.patch('/admin/:id/archive', auth, newsController.archiveNews);
router.delete('/admin/:id', auth, newsController.deleteNews);

// Move specific ID route to the end to avoid conflicts with other routes
router.get('/:id', newsController.getNewsById);

// Dashboard routes for mobile app
router.get('/dashboard/news', newsController.getLatestNews);
router.get('/dashboard/news/featured', newsController.getFeaturedNews);

module.exports = router;