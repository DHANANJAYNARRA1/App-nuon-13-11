const Booking = require('../models/Booking');
const ZoomSession = require('../models/ZoomSession');
const { getSocket } = require('../utils/socket');

// Create booking
const createBooking = async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      nurseId: req.user._id || req.user.id
    });
    await booking.save();
    try {
      const io = getSocket();
      if (io) io.emit('notification', { type: 'booking:created', booking });
    } catch (e) {
  const logger = require('../lib/logger');
  logger.warn('bookingController: socket emit failed', e.message);
    }
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ nurseId: req.user._id || req.user.id })
      .populate('mentorId', 'name email')
      .sort({ dateTime: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    try {
      const io = getSocket();
      if (io) io.emit('notification', { type: 'booking:updated', booking });
    } catch (e) {
  const logger = require('../lib/logger');
  logger.warn('bookingController: socket emit failed', e.message);
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create Zoom session for booking
const createZoomSession = async (req, res) => {
  try {
    const { zoomLink } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking with zoom link
    booking.zoomLink = zoomLink;
    await booking.save();

    // Create zoom session record
    const zoomSession = new ZoomSession({
      bookingId: booking._id,
      mentorId: booking.mentorId,
      nurseId: booking.nurseId,
      zoomLink,
      scheduledTime: booking.dateTime
    });
    
    await zoomSession.save();
    res.json({ message: 'Zoom session created successfully', zoomSession });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
  createZoomSession
};