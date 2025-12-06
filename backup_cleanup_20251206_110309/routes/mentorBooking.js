const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const MentorAvailability = require('../models/MentorAvailability');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Get all available mentor slots for users to book
const getAvailableMentorSlots = async (req, res) => {
  try {
    const { 
      mentorId, 
      specialization, 
      sessionType, 
      date, 
      page = 1, 
      limit = 20 
    } = req.query;

    let filter = {
      isActive: true,
      startDateTime: { $gte: new Date() }, // Only future slots
    };

    // Add optional filters
    if (mentorId) filter.mentorId = mentorId;
    if (specialization) filter.specializations = { $in: [specialization] };
    if (sessionType) filter.sessionType = sessionType;
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      filter.startDateTime = { 
        $gte: startOfDay, 
        $lte: endOfDay 
      };
    }

    const availableSlots = await MentorAvailability.find(filter)
      .populate('mentorId', 'name email specialization profilePicture experience')
      .sort({ startDateTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Filter out slots that are fully booked
    const openSlots = availableSlots.filter(slot => 
      slot.currentBookings < slot.maxBookings
    );

    const total = await MentorAvailability.countDocuments(filter);

    res.json({
      success: true,
      slots: openSlots,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSlots: total,
        availableSlots: openSlots.length
      }
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching available slots',
      error: error.message 
    });
  }
};

// Book a mentor slot
const bookMentorSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { notes } = req.body;
    const userId = req.user._id || req.user.id;

    // Find the availability slot
    const slot = await MentorAvailability.findById(slotId)
      .populate('mentorId', 'name email');

    if (!slot) {
      return res.status(404).json({ 
        success: false, 
        message: 'Availability slot not found' 
      });
    }

    if (!slot.isActive) {
      return res.status(400).json({ 
        success: false, 
        message: 'This slot is no longer available' 
      });
    }

    if (slot.currentBookings >= slot.maxBookings) {
      return res.status(400).json({ 
        success: false, 
        message: 'This slot is fully booked' 
      });
    }

    if (slot.startDateTime <= new Date()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot book past slots' 
      });
    }

    // Check if user already booked this slot
    const existingBooking = slot.bookings.find(
      booking => booking.userId.toString() === userId.toString()
    );

    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already booked this slot' 
      });
    }

    // Create booking record
    const booking = await Booking.create({
      nurseId: userId,
      mentorId: slot.mentorId._id,
      dateTime: slot.startDateTime,
      duration: slot.duration,
      sessionType: 'mentorship',
      status: 'confirmed',
      price: slot.price,
      notes: notes || '',
      availabilitySlotId: slotId,
      zoomLink: slot.meetingLink || ''
    });

    // Update availability slot
    slot.bookings.push({
      userId: userId,
      bookingId: booking._id,
      status: 'confirmed'
    });
    slot.currentBookings += 1;
    await slot.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('mentorId', 'name email specialization')
      .populate('nurseId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Slot booked successfully',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Book slot error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error booking slot',
      error: error.message 
    });
  }
};

// Get user's mentor session bookings
const getUserMentorBookings = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { status, upcoming } = req.query;

    let filter = { nurseId: userId, sessionType: 'mentorship' };
    
    if (status) filter.status = status;
    if (upcoming === 'true') {
      filter.dateTime = { $gte: new Date() };
    }

    const bookings = await Booking.find(filter)
      .populate('mentorId', 'name email specialization profilePicture')
      .populate('availabilitySlotId')
      .sort({ dateTime: upcoming === 'true' ? 1 : -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get user mentor bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching bookings',
      error: error.message 
    });
  }
};

// Cancel a booking
const cancelMentorBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id || req.user.id;

    const booking = await Booking.findOne({ 
      _id: bookingId, 
      nurseId: userId 
    });

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking is already cancelled' 
      });
    }

    // Check if cancellation is allowed (e.g., at least 24 hours before)
    const hoursUntilSession = (booking.dateTime - new Date()) / (1000 * 60 * 60);
    if (hoursUntilSession < 24) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel booking less than 24 hours before the session' 
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update availability slot
    if (booking.availabilitySlotId) {
      const slot = await MentorAvailability.findById(booking.availabilitySlotId);
      if (slot) {
        slot.currentBookings = Math.max(0, slot.currentBookings - 1);
        slot.bookings = slot.bookings.filter(
          b => b.bookingId.toString() !== bookingId.toString()
        );
        await slot.save();
      }
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error cancelling booking',
      error: error.message 
    });
  }
};

// Routes
router.get('/mentors/availability', auth, getAvailableMentorSlots);
router.post('/mentors/availability/:slotId/book', auth, bookMentorSlot);
router.get('/my/mentor-bookings', auth, getUserMentorBookings);
router.put('/my/mentor-bookings/:bookingId/cancel', auth, cancelMentorBooking);

module.exports = router;