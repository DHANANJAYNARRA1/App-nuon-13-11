const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const MentorAvailability = require('../models/MentorAvailability');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Get all mentors with their availability for mobile app
const getMentorsWithAvailability = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' })
      .select('name email specialization experience location profilePicture')
      .lean();

    const mentorsWithSlots = await Promise.all(mentors.map(async (mentor) => {
      // Get upcoming available slots
      const availableSlots = await MentorAvailability.find({
        mentorId: mentor._id,
        isActive: true,
        startDateTime: { $gte: new Date() },
        currentBookings: { $lt: { $expr: '$maxBookings' } }
      })
      .sort({ startDateTime: 1 })
      .limit(5);

      // Ensure all required fields are present and set defaults if missing
      return {
        _id: mentor._id,
        name: mentor.name || '',
        email: mentor.email || '',
        specialization: mentor.specialization || '',
        experience: mentor.experience || 0,
        location: mentor.location || '',
        profilePicture: mentor.profilePicture || '',
        upcomingSlots: availableSlots,
        hasAvailability: availableSlots.length > 0
      };
    }));

    res.json({
      success: true,
      mentors: mentorsWithSlots
    });
  } catch (error) {
    console.error('Get mentors with availability error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching mentors',
      error: error.message 
    });
  }
};

// Get user's upcoming sessions with Zoom links
const getUpcomingSessions = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const upcomingBookings = await Booking.find({
      nurseId: userId,
      sessionType: 'mentorship',
      status: { $in: ['confirmed', 'pending'] },
      dateTime: { $gte: new Date() }
    })
    .populate('mentorId', 'name email specialization profilePicture')
    .populate('availabilitySlotId', 'title description meetingType meetingLink')
    .sort({ dateTime: 1 });

    const sessions = upcomingBookings.map(booking => ({
      bookingId: booking._id,
      title: booking.availabilitySlotId?.title || 'Mentorship Session',
      description: booking.availabilitySlotId?.description || '',
      dateTime: booking.dateTime,
      duration: booking.duration,
      mentor: booking.mentorId,
      status: booking.status,
      zoomLink: booking.zoomLink || booking.availabilitySlotId?.meetingLink || '',
      meetingType: booking.availabilitySlotId?.meetingType || 'zoom',
      notes: booking.notes,
      canJoin: new Date(booking.dateTime) <= new Date(Date.now() + 15 * 60 * 1000) // Can join 15 minutes before
    }));

    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error('Get upcoming sessions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching sessions',
      error: error.message 
    });
  }
};

// Get session details including Zoom link (for when user wants to join)
const getSessionDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id || req.user.id;

    const booking = await Booking.findOne({
      _id: bookingId,
      nurseId: userId
    })
    .populate('mentorId', 'name email specialization profilePicture')
    .populate('availabilitySlotId', 'title description meetingType meetingLink');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const sessionStart = new Date(booking.dateTime);
    const now = new Date();
    const sessionEnd = new Date(sessionStart.getTime() + booking.duration * 60 * 1000);

    // Check if user can join (15 minutes before to 30 minutes after start)
    const canJoin = now >= new Date(sessionStart.getTime() - 15 * 60 * 1000) && 
                   now <= new Date(sessionStart.getTime() + 30 * 60 * 1000);

    const sessionDetails = {
      bookingId: booking._id,
      title: booking.availabilitySlotId?.title || 'Mentorship Session',
      description: booking.availabilitySlotId?.description || '',
      dateTime: booking.dateTime,
      duration: booking.duration,
      mentor: booking.mentorId,
      status: booking.status,
      zoomLink: booking.zoomLink || booking.availabilitySlotId?.meetingLink || '',
      meetingType: booking.availabilitySlotId?.meetingType || 'zoom',
      notes: booking.notes,
      canJoin,
      sessionStart,
      sessionEnd,
      timeStatus: now < sessionStart ? 'upcoming' : 
                 now > sessionEnd ? 'completed' : 'active'
    };

    res.json({
      success: true,
      session: sessionDetails
    });
  } catch (error) {
    console.error('Get session details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching session details',
      error: error.message 
    });
  }
};

// Routes
router.get('/mobile/mentors', auth, getMentorsWithAvailability);
router.get('/mobile/my-sessions', auth, getUpcomingSessions);
router.get('/mobile/session/:bookingId', auth, getSessionDetails);

module.exports = router;