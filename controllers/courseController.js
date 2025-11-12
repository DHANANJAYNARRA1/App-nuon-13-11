const Course = require('../models/Course');
const Purchase = require('../models/Purchase');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { emitNewCourse, emitCourseUpdate } = require('../utils/socket');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get all courses (public)
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// Get course details
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const course = await Course.findById(id)
      .populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user has purchased the course
    let hasPurchased = false;
    if (userId) {
      const purchase = await Purchase.findOne({
        userId,
        courseId,
        status: 'completed'
      });
      hasPurchased = !!purchase;
    }

    // If not purchased and course is not free, hide video URLs
    if (!hasPurchased && course.price > 0) {
      course.lessons = course.lessons.map(lesson => ({
        ...lesson.toObject(),
        videoUrl: undefined
      }));
    }

    res.json({
      success: true,
      course,
      hasPurchased
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// Create new course (Admin/Instructor only)
const createCourse = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    console.log('CREATE COURSE PAYLOAD:', req.body);
    
    // Always use the uploaded image for the course thumbnail if present, or fallback to lesson thumbnail if available
    let thumbnailUrl = '';
    if (req.files && req.files.thumbnail) {
      try {
        const thumbnailResult = await cloudinary.uploader.upload(req.files.thumbnail[0].path, {
          folder: 'course-thumbnails',
          resource_type: 'image'
        });
        thumbnailUrl = thumbnailResult.secure_url;
      } catch (uploadError) {
        console.log('Thumbnail upload failed, using placeholder');
        thumbnailUrl = '';
      }
    }
    // If no explicit course thumbnail, use the lesson thumbnail if available
    if (!thumbnailUrl && req.body.lessons && Array.isArray(req.body.lessons) && req.body.lessons[0]?.thumbnail) {
      thumbnailUrl = req.body.lessons[0].thumbnail;
    }
    // If still no thumbnail, fallback to placeholder
    if (!thumbnailUrl) {
      thumbnailUrl = 'https://via.placeholder.com/400x300/667eea/ffffff?text=Course+Thumbnail';
    }

    // Support both array and legacy lessons format, and ensure lesson.thumbnail is present
    let lessons = [];
    if (Array.isArray(req.body.lessons) && req.body.lessons.length > 0) {
      lessons = req.body.lessons.map((lesson, idx) => ({
        ...lesson,
        order: lesson.order || idx + 1,
        thumbnail: lesson.thumbnail || '' // always include thumbnail field
      }));
    } else {
      // Legacy: parse lessons from form fields
      const processedLessons = [];
      const lessonKeys = Object.keys(req.body).filter(key => key.startsWith('lessons['));
      const lessonCount = Math.max(0, ...lessonKeys.map(key => {
        const match = key.match(/lessons\[(\d+)\]/);
        return match ? parseInt(match[1]) + 1 : 0;
      }));
      for (let i = 0; i < lessonCount; i++) {
        const title = req.body[`lessons[${i}][title]`];
        const videoUrl = req.body[`lessons[${i}][videoUrl]`] || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        const thumbnail = req.body[`lessons[${i}][thumbnail]`] || '';
        const duration = parseInt(req.body[`lessons[${i}][duration]`]) || 1800;
        if (title) {
          processedLessons.push({
            title,
            videoUrl,
            thumbnail,
            duration,
            order: i + 1
          });
        }
      }
      lessons = processedLessons;
    }
    const course = new Course({
      title,
      description,
      price: parseFloat(price) || 0,
      thumbnail: thumbnailUrl,
      lessons,
      instructor: req.user.id
    });

    await course.save();

    // Emit real-time update
    try {
      emitNewCourse(course);
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// Get user's purchased courses
const getMyCourses = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      userId: req.user.id,
      status: 'completed'
    }).populate({
      path: 'courseId',
      populate: {
        path: 'instructor',
        select: 'name email'
      }
    });

    const courses = purchases.map(purchase => purchase.courseId);

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching purchased courses',
      error: error.message
    });
  }
};

// Purchase course
const purchaseCourse = async (req, res) => {
  try {
    // Debug: Log incoming request
    console.log('--- PURCHASE COURSE REQUEST ---');
    console.log('req.body:', req.body);
    console.log('req.params:', req.params);
    console.log('req.user:', req.user);

    // Support both body and param for courseId
    const courseId = req.body.courseId || req.params.id;
    console.log('Resolved courseId:', courseId);
    const course = await Course.findById(courseId);
    if (!course) {
      console.log('Course not found for courseId:', courseId);
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    console.log('Course found:', course.title, 'price:', course.price);
    // Check if already purchased
    const existingPurchase = await Purchase.findOne({ userId: req.user.id, courseId });
    if (existingPurchase) {
      console.log('User already purchased this course:', req.user.id, courseId);
      return res.status(400).json({ success: false, message: 'Course already purchased' });
    }
    // For free courses, always set paymentMethod/paymentId to 'free'
    let paymentMethod = req.body.paymentMethod;
    let paymentId = req.body.paymentId;
    if (course.price === 0) {
      paymentMethod = 'free';
      paymentId = 'free';
      console.log('Detected free course, setting paymentMethod/paymentId to free');
    }
    if (!paymentMethod || !paymentId) {
      console.log('Missing payment info:', paymentMethod, paymentId);
      return res.status(400).json({ success: false, message: 'Missing payment info' });
    }
    const purchase = new Purchase({
      userId: req.user.id,
      courseId,
      amount: course.price,
      paymentMethod,
      paymentId,
      status: 'completed'
    });
    await purchase.save();
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
    console.log('Purchase created successfully:', purchase._id);
    res.json({ success: true, message: 'Course purchased successfully', purchase });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ success: false, message: 'Error purchasing course', error: error.message });
  }
};

// Delete course (Admin only)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Attempting to delete course with ID:', id);

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      console.log('❌ Course not found for ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    console.log('✅ Course deleted successfully:', course.title);

    // Emit real-time update
    try {
      emitCourseUpdate(course._id, 'deleted', course);
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  getMyCourses,
  purchaseCourse,
  deleteCourse
};