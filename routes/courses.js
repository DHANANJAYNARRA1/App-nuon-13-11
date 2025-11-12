const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { auth } = require('../middleware/auth');


// Get all courses (public)
router.get('/', courseController.getAllCourses);

// Get my courses (protected) - this needs special handling
router.get('/my', auth, courseController.getMyCourses);

// Get course by ID (public)
router.get('/:id', courseController.getCourseById);

// Create course (protected)
router.post('/', auth, courseController.createCourse);

// Purchase course (protected)
router.post('/:id/purchase', auth, courseController.purchaseCourse);

// Delete course (protected)
router.delete('/:id', auth, courseController.deleteCourse);

module.exports = router;