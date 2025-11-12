const User = require('../models/User');
const Booking = require('../models/Booking');
const Feedback = require('../models/Feedback');
const ZoomSession = require('../models/ZoomSession');
const MentorAvailability = require('../models/MentorAvailability');
const zoomService = require('../services/zoomService');
const multer = require('multer');
const path = require('path');
const { emitMentorAvailabilityUpdate, emitNewMentorAvailability, emitBookingUpdate, emitUserActivity, emitToRole } = require('../utils/socket');
const Mentor = require('../models/Mentor');
const express = require('express');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'mentor-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get mentor statistics
// Add detailed logging to debug the getStats method
const getStats = async (req, res) => {
  try {
    console.log('getStats method called');
    const mentorId = req.user?._id || req.user?.id;

    if (!mentorId) {
      console.error('Mentor ID is missing');
      return res.status(400).json({ message: 'Mentor ID is required' });
    }

    console.log('Mentor ID:', mentorId);

    const totalSessions = await Booking.countDocuments({ mentorId });
    console.log('Total Sessions:', totalSessions);

    const upcomingSessions = await Booking.countDocuments({
      mentorId,
      status: 'confirmed',
      dateTime: { $gte: new Date() }
    });
    console.log('Upcoming Sessions:', upcomingSessions);

    const attendedSessions = await Booking.countDocuments({
      mentorId,
      status: 'completed'
    });
    console.log('Attended Sessions:', attendedSessions);

    const pendingSessions = await Booking.countDocuments({
      mentorId,
      status: { $in: ['confirmed', 'pending'] },
      dateTime: { $gte: new Date() }
    });
    console.log('Pending Sessions:', pendingSessions);

    const totalNurses = await Booking.distinct('nurseId', { mentorId });
    console.log('Total Nurses:', totalNurses);

    const feedbackData = await Feedback.find({ mentorId });
    const averageRating = feedbackData.length > 0
      ? feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length
      : 0;
    console.log('Average Rating:', averageRating);

    res.json({
      totalSessions,
      upcomingSessions,
      attendedSessions,
      pendingSessions,
      totalNurses: totalNurses.length,
      averageRating
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get mentor bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ mentorId: req.user._id || req.user.id })
      .populate('nurseId', 'name email')
      .sort({ dateTime: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get mentor sessions
const getSessions = async (req, res) => {
  try {
    const sessions = await ZoomSession.find({ mentorId: req.user.id })
      .populate('bookingId')
      .sort({ scheduledTime: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get mentor feedback
const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ mentorId: req.user.id })
      .populate('nurseId', 'name email')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get nurses mentored by this mentor
const getNurses = async (req, res) => {
  try {
    const bookings = await Booking.find({ mentorId: req.user.id })
      .populate('nurseId', 'name email')
      .distinct('nurseId');
    
    const nurses = bookings.map(booking => booking.nurseId);
    res.json(nurses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update mentor profile
// Enhance debugging logs in updateProfile
const updateProfile = async (req, res) => {
  try {
    const mentorId = req.user._id || req.user.id;
    const updates = req.body;

    console.log('Update profile request received:', { mentorId, updates });

    // Ensure isProfileComplete is set to true
    updates.isProfileComplete = true;

    // Attempt to update mentor profile
    const updatedMentor = await Mentor.findByIdAndUpdate(mentorId, updates, { new: true });

    if (!updatedMentor) {
      console.log('Mentor not found in database:', mentorId);
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    console.log('Profile updated successfully in database:', updatedMentor);
    res.json({
      success: true,
      message: 'Profile updated successfully',
      mentor: updatedMentor
    });
  } catch (error) {
    console.error('Error during profile update:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// MENTOR AVAILABILITY MANAGEMENT

// Create availability slot
// Add debugging logs to createAvailabilitySlot
const createAvailabilitySlot = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      startDateTime, 
      endDateTime, 
      duration, 
      maxBookings, 
      price, 
      sessionType, 
      meetingType, 
      specializations 
    } = req.body;

    const mentorId = req.user._id || req.user.id;

    console.log('Create availability request:', {
      mentorId,
      title,
      description,
      startDateTime,
      endDateTime,
      duration,
      maxBookings,
      price,
      sessionType,
      meetingType,
      specializations
    });

    // Validate dates
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    
    if (start >= end) {
      console.log('Invalid time range:', { start, end });
      return res.status(400).json({ 
        success: false, 
        message: 'Start time must be before end time' 
      });
    }

    if (start <= new Date()) {
      console.log('Start time in the past:', start);
      return res.status(400).json({ 
        success: false, 
        message: 'Start time must be in the future' 
      });
    }

    // Check for overlapping slots
    const overlapping = await MentorAvailability.findOne({
      mentorId,
      isActive: true,
      $or: [
        { startDateTime: { $lt: end, $gte: start } },
        { endDateTime: { $gt: start, $lte: end } },
        { startDateTime: { $lte: start }, endDateTime: { $gte: end } }
      ]
    });

    if (overlapping) {
      console.log('Overlapping slot found:', overlapping);
      return res.status(400).json({ 
        success: false, 
        message: 'This time slot overlaps with an existing availability' 
      });
    }

    // Create Zoom meeting if meetingType is zoom
    let meetingLink = '';
    if ((meetingType || 'zoom') === 'zoom') {
      try {
        const mentor = await User.findById(mentorId);
        const zoomMeeting = await zoomService.createMentorshipMeeting(
          mentor.name,
          'Mentorship Session',
          start,
          duration || 60
        );
        meetingLink = zoomMeeting.join_url;
        console.log(`Zoom meeting created for ${mentor.name}: ${meetingLink}`);
      } catch (error) {
        console.error('Failed to create Zoom meeting:', error);
        // Continue without meeting link
      }
    }

    const availability = await MentorAvailability.create({
      mentorId,
      title,
      description,
      startDateTime: start,
      endDateTime: end,
      duration: duration || 60,
      maxBookings: maxBookings || 1,
      price: price || 0,
      sessionType: sessionType || 'one-on-one',
      meetingType: meetingType || 'zoom',
      meetingLink: meetingLink,
      specializations: specializations || []
    });

    const populatedAvailability = await MentorAvailability.findById(availability._id)
      .populate('mentorId', 'name email specialization');

    console.log('Availability slot created successfully:', populatedAvailability);

    // Emit real-time updates
    try {
      emitNewMentorAvailability(populatedAvailability);
      emitMentorAvailabilityUpdate(mentorId, 'created', populatedAvailability);
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    res.status(201).json({
      success: true,
      message: 'Availability slot created successfully',
      availability: populatedAvailability
    });
  } catch (error) {
    console.error('Create availability error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating availability slot',
      error: error.message 
    });
  }
};

// Get mentor's availability slots
const getMentorAvailability = async (req, res) => {
  try {
    const mentorId = req.user._id || req.user.id;
    const { upcoming, page = 1, limit = 20 } = req.query;

    let filter = { mentorId };
    
    if (upcoming === 'true') {
      filter.startDateTime = { $gte: new Date() };
      filter.isActive = true;
    }

    const availability = await MentorAvailability.find(filter)
      .populate('mentorId', 'name email specialization')
      .populate('bookings.userId', 'name email')
      .sort({ startDateTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MentorAvailability.countDocuments(filter);

    res.json({
      success: true,
      availability,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSlots: total
      }
    });
  } catch (error) {
    console.error('Get mentor availability error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching availability',
      error: error.message 
    });
  }
};

// Update availability slot
const updateAvailabilitySlot = async (req, res) => {
  try {
    const { id } = req.params;
    const mentorId = req.user._id || req.user.id;
    const updates = req.body;

    // Validate ownership
    const slot = await MentorAvailability.findOne({ _id: id, mentorId });
    if (!slot) {
      return res.status(404).json({ 
        success: false, 
        message: 'Availability slot not found' 
      });
    }

    // Don't allow updates if there are confirmed bookings
    if (slot.currentBookings > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot modify slot with existing bookings' 
      });
    }

    // Validate dates if being updated
    if (updates.startDateTime && updates.endDateTime) {
      const start = new Date(updates.startDateTime);
      const end = new Date(updates.endDateTime);
      
      if (start >= end) {
        return res.status(400).json({ 
          success: false, 
          message: 'Start time must be before end time' 
        });
      }

      if (start <= new Date()) {
        return res.status(400).json({ 
          success: false, 
          message: 'Start time must be in the future' 
        });
      }
    }

    const updatedSlot = await MentorAvailability.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).populate('mentorId', 'name email specialization');

    // Emit real-time updates
    try {
      emitMentorAvailabilityUpdate(mentorId, 'updated', updatedSlot);
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    res.json({
      success: true,
      message: 'Availability slot updated successfully',
      availability: updatedSlot
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating availability slot',
      error: error.message 
    });
  }
};

// Delete availability slot
const deleteAvailabilitySlot = async (req, res) => {
  try {
    const { id } = req.params;
    const mentorId = req.user._id || req.user.id;

    const slot = await MentorAvailability.findOne({ _id: id, mentorId });
    if (!slot) {
      return res.status(404).json({ 
        success: false, 
        message: 'Availability slot not found' 
      });
    }

    // Don't allow deletion if there are confirmed bookings
    if (slot.currentBookings > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete slot with existing bookings. Cancel bookings first.' 
      });
    }

    await MentorAvailability.findByIdAndDelete(id);

    // Emit real-time updates
    try {
      emitMentorAvailabilityUpdate(mentorId, 'deleted', { id });
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    res.json({
      success: true,
      message: 'Availability slot deleted successfully'
    });
  } catch (error) {
    console.error('Delete availability error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting availability slot',
      error: error.message 
    });
  }
};

// Get public list of mentors (for mobile app and web users)
// Enhance logging for getPublicMentors
const getPublicMentors = async (req, res) => {
  try {
    console.log('Fetching public mentors...');
    const query = { isPublic: true, isActive: true };
    console.log('Query:', query);

    // Log total mentors in the database
    const totalMentors = await Mentor.countDocuments();
    console.log(`Total mentors in the database: ${totalMentors}`);

    // Log mentors that match the query
    const mentors = await Mentor.find(query);
    console.log(`Query Result: ${JSON.stringify(mentors, null, 2)}`);
    console.log(`Found ${mentors.length} public mentors.`);

    res.json(mentors);
  } catch (error) {
    console.error('Error fetching public mentors:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get mentor availability for public viewing
// Enhance logging for getMentorAvailabilityPublic
const getMentorAvailabilityPublic = async (req, res) => {
  try {
    const { mentorId } = req.params;
    console.log(`Fetching availability for mentor ID: ${mentorId}`);
    const availability = await MentorAvailability.find({ mentorId });
    console.log(`Found ${availability.length} availability slots for mentor ID: ${mentorId}`);
    res.json(availability);
  } catch (error) {
    console.error('Error fetching mentor availability:', error);
    res.status(500).json({ message: error.message });
  }
};

// Apply to become a mentor
const applyForMentor = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      qualification,
      department,
      hospital,
      bio,
      hourlyRate,
      specializations,
      experience,
      profilePicture
    } = req.body;

    // Check if user is already a mentor
    const existingMentor = await User.findOne({ _id: userId, role: 'mentor' });
    if (existingMentor) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered as a mentor'
      });
    }

    // Update user to mentor role and add mentor-specific fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role: 'mentor',
        qualification,
        department,
        hospital,
        bio,
        hourlyRate: parseFloat(hourlyRate) || 0,
        specialization: specializations || [],
        experience: parseInt(experience) || 0,
        profilePicture: profilePicture || '',
        availability: 'available'
      },
      { new: true }
    );

    // Emit real-time updates for admin notifications
    try {
      emitUserActivity(userId, { action: 'applied_for_mentor', user: updatedUser });
      emitToRole('admin', 'mentor_application', { user: updatedUser, applicationData: { qualification, department, hospital, bio, hourlyRate, specializations, experience } });
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    res.json({
      success: true,
      message: 'Mentor application submitted successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Apply for mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Error applying for mentor role',
      error: error.message
    });
  }
};

// Book a mentor session
const bookMentorSession = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { availabilityId, notes } = req.body;

    // Find the availability slot
    const availability = await MentorAvailability.findById(availabilityId);
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Availability slot not found'
      });
    }

    // Check if slot is still available
    if (!availability.isActive || availability.currentBookings >= availability.maxBookings) {
      return res.status(400).json({
        success: false,
        message: 'This slot is no longer available'
      });
    }

    // Check if user already has a booking for this slot
    const existingBooking = await Booking.findOne({
      userId,
      availabilityId,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a booking for this slot'
      });
    }

    // Create booking
    const booking = await Booking.create({
      userId,
      mentorId: availability.mentorId,
      availabilityId,
      status: 'pending',
      notes: notes || '',
      amount: availability.price,
      meetingType: availability.meetingType,
      meetingLink: availability.meetingLink
    });

    // Update availability current bookings
    await MentorAvailability.findByIdAndUpdate(availabilityId, {
      $inc: { currentBookings: 1 }
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('mentorId', 'name email specialization')
      .populate('userId', 'name email');

    // Emit real-time updates
    try {
      emitBookingUpdate(userId, populatedBooking);
      emitMentorAvailabilityUpdate(availability.mentorId, 'booked', { availabilityId, booking: populatedBooking });
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Book mentor session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking mentor session',
      error: error.message
    });
  }
};

// Get user's bookings
const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const bookings = await Booking.find({ userId })
      .populate('mentorId', 'name email specialization profilePicture')
      .populate('availabilityId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Add a temporary route for testing database queries in getStats
const testDatabaseQueries = async (req, res) => {
  try {
    console.log('Testing database queries for getStats');
    const mentorId = req.query.mentorId || 'default-mentor-id'; // Replace with a valid mentor ID

    const totalSessions = await Booking.countDocuments({ mentorId });
    console.log('Total Sessions:', totalSessions);

    const upcomingSessions = await Booking.countDocuments({
      mentorId,
      status: 'confirmed',
      dateTime: { $gte: new Date() }
    });
    console.log('Upcoming Sessions:', upcomingSessions);

    const attendedSessions = await Booking.countDocuments({
      mentorId,
      status: 'completed'
    });
    console.log('Attended Sessions:', attendedSessions);

    const pendingSessions = await Booking.countDocuments({
      mentorId,
      status: { $in: ['confirmed', 'pending'] },
      dateTime: { $gte: new Date() }
    });
    console.log('Pending Sessions:', pendingSessions);

    const totalNurses = await Booking.distinct('nurseId', { mentorId });
    console.log('Total Nurses:', totalNurses);

    res.json({
      totalSessions,
      upcomingSessions,
      attendedSessions,
      pendingSessions,
      totalNurses: totalNurses.length
    });
  } catch (error) {
    console.error('Error testing database queries:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add the route for testing
router.get('/test-database-queries', testDatabaseQueries);

const createMentor = async (req, res) => {
  try {
    const { name, bio, profilePicture, price, specialization } = req.body;

    console.log('Creating new mentor with details:', { name, bio, profilePicture, price, specialization });

    const newMentor = await Mentor.create({
      name,
      bio,
      profilePicture,
      price,
      specialization,
      isPublic: true,
      isActive: true,
      isProfileComplete: true
    });

    console.log('Mentor created successfully:', newMentor);
    res.status(201).json({
      success: true,
      message: 'Mentor created successfully',
      mentor: newMentor
    });
  } catch (error) {
    console.error('Error creating mentor:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating mentor',
      error: error.message
    });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { mentorId } = req.params;
    console.log(`Fetching available slots for mentor ID: ${mentorId}`);

    const slots = await MentorAvailability.find({
      mentorId,
      isActive: true,
      currentBookings: { $lt: 1 } // Ensure slot is not booked
    });

    console.log(`Found ${slots.length} available slots for mentor ID: ${mentorId}`);
    res.json({
      success: true,
      slots
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available slots',
      error: error.message
    });
  }
};

const bookSlot = async (req, res) => {
  try {
    const { slotId, userId } = req.body;
    console.log(`Booking slot ID: ${slotId} for user ID: ${userId}`);

    const slot = await MentorAvailability.findById(slotId);
    if (!slot || !slot.isActive || slot.currentBookings >= 1) {
      return res.status(400).json({
        success: false,
        message: 'Slot is not available'
      });
    }

    slot.currentBookings += 1;
    await slot.save();

    console.log('Slot booked successfully:', slot);
    res.json({
      success: true,
      message: 'Slot booked successfully',
      slot
    });
  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking slot',
      error: error.message
    });
  }
};

const getAllMentors = async (req, res) => {
  try {
    console.log('Fetching all mentors added by admin...');

    const mentors = await Mentor.find({ isPublic: true, isActive: true });
    console.log(`Found ${mentors.length} mentors.`);

    res.json({
      success: true,
      mentors
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mentors',
      error: error.message
    });
  }
};

module.exports = {
  getStats,
  getBookings,
  getSessions,
  getFeedback,
  getNurses,
  updateProfile,
  createAvailabilitySlot,
  getMentorAvailability,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
  getPublicMentors,
  getMentorAvailabilityPublic,
  applyForMentor,
  bookMentorSession,
  getMyBookings,
  createMentor,
  getAvailableSlots,
  bookSlot,
  getAllMentors
};