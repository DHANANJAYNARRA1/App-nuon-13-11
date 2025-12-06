const Feedback = require('../models/Feedback');
const { getSocket } = require('../utils/socket');

const submitFeedback = async (req, res) => {
  try {
    const { nurseId } = req.params;
    const { rating, comments, skills, bookingId } = req.body;

    const feedback = await Feedback.create({
      mentorId: req.user._id,
      nurseId,
      bookingId,
      rating,
      comments,
      skills
    });

    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('mentorId', 'name email')
      .populate('nurseId', 'name email')
      .populate('bookingId');

    try {
      const io = getSocket();
      if (io) io.emit('notification', { type: 'feedback:submitted', feedback: populatedFeedback });
    } catch (e) {
  const logger = require('../lib/logger');
  logger.warn('feedbackController: socket emit failed', e.message);
    }

    res.status(201).json(populatedFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeedback = async (req, res) => {
  try {
    const { nurseId, mentorId } = req.query;
    let filter = {};

    if (nurseId) filter.nurseId = nurseId;
    if (mentorId) filter.mentorId = mentorId;

    const feedback = await Feedback.find(filter)
      .populate('mentorId', 'name email')
      .populate('nurseId', 'name email')
      .populate('bookingId')
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitFeedback,
  getFeedback
};