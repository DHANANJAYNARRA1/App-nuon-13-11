const UserProgress = require('../models/UserProgress');
const Course = require('../models/Course');
const Purchase = require('../models/Purchase');

// Get user progress for a course
const getUserProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if user has purchased the course
    const purchase = await Purchase.findOne({
      userId,
      courseId,
      status: 'completed'
    });

    if (!purchase) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Please purchase the course first.'
      });
    }

    let progress = await UserProgress.findOne({ userId, courseId });

    if (!progress) {
      // Initialize progress if not exists
      const course = await Course.findById(courseId);
      progress = new UserProgress({
        userId,
        courseId,
        lessons: course.lessons.map(lesson => ({
          lessonId: lesson._id,
          completed: false
        })),
        currentLesson: course.lessons[0]?._id || null
      });
      await progress.save();
    }

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching progress',
      error: error.message
    });
  }
};

// Update lesson progress
const updateLessonProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { completed, timeSpent } = req.body;
    const userId = req.user.id;

    let progress = await UserProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found'
      });
    }

    // Update lesson progress
    const lessonIndex = progress.lessons.findIndex(
      lesson => lesson.lessonId.toString() === lessonId
    );

    if (lessonIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found in progress'
      });
    }

    progress.lessons[lessonIndex].completed = completed;
    if (completed && !progress.lessons[lessonIndex].completedAt) {
      progress.lessons[lessonIndex].completedAt = new Date();
    }
    progress.lessons[lessonIndex].timeSpent = timeSpent || 0;

    // Update current lesson
    if (completed) {
      const nextLessonIndex = lessonIndex + 1;
      if (nextLessonIndex < progress.lessons.length) {
        progress.currentLesson = progress.lessons[nextLessonIndex].lessonId;
      }
    }

    // Calculate overall progress
    const completedLessons = progress.lessons.filter(lesson => lesson.completed).length;
    progress.progress = Math.round((completedLessons / progress.lessons.length) * 100);

    // Mark course as completed
    if (progress.progress === 100 && !progress.completedAt) {
      progress.completedAt = new Date();
    }

    await progress.save();

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating progress',
      error: error.message
    });
  }
};

// Get all user progress
const getAllUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const progress = await UserProgress.find({ userId })
      .populate('courseId', 'title thumbnail lessons')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching progress',
      error: error.message
    });
  }
};

// Download certificate
const downloadCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const progress = await UserProgress.findOne({ userId, courseId });

    if (!progress || progress.progress < 100) {
      return res.status(400).json({
        success: false,
        message: 'Course not completed yet'
      });
    }

    // Mark certificate as downloaded
    progress.certificateDownloaded = true;
    await progress.save();

    // In a real app, you'd generate a PDF certificate here
    // For now, return success
    res.json({
      success: true,
      message: 'Certificate downloaded successfully',
      certificateUrl: `/certificates/${courseId}/${userId}.pdf`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error downloading certificate',
      error: error.message
    });
  }
};

module.exports = {
  getUserProgress,
  updateLessonProgress,
  getAllUserProgress,
  downloadCertificate
};