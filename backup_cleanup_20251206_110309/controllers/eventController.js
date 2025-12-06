const Event = require('../models/Event');
const Purchase = require('../models/Purchase');
const mongoose = require('mongoose');
const { emitNewEvent, emitEventUpdate } = require('../utils/socket');

// Get all events (public)
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true })
      .populate('instructor', 'name email')
      .sort({ date: 1 });

    // Defensive: ensure thumbnail is always present in the response
    const eventsWithThumb = events.map(ev => {
      const obj = ev.toObject();
      if (!obj.thumbnail && obj.imageUrl) obj.thumbnail = obj.imageUrl;
      return obj;
    });

    res.json({
      success: true,
      events: eventsWithThumb
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get event details
const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    const event = await Event.findById(eventId)
      .populate('instructor', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has registered
    let hasRegistered = false;
    if (userId) {
      const purchase = await Purchase.findOne({
        userId,
        eventId,
        status: 'completed'
      });
      hasRegistered = !!purchase;
    }

    res.json({
      success: true,
      event,
      hasRegistered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Register for event
const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { paymentId, paymentMethod } = req.body;

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if already registered
    const existingPurchase = await Purchase.findOne({
      userId: req.user.id,
      eventId
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event'
      });
    }

    // Check capacity
    if (event.capacity > 0 && event.registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Defensive: ensure paymentId and paymentMethod are present
    if (!paymentId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing paymentId or paymentMethod'
      });
    }

    const purchase = new Purchase({
      userId: req.user.id,
      eventId,
      amount: event.price,
      paymentMethod,
      paymentId,
      status: 'completed'
    });

    try {
      await purchase.save();
    } catch (err) {
      console.error('[event][registerForEvent] Purchase save error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to save purchase',
        error: err.message
      });
    }

    // Update registered count
    try {
      await Event.findByIdAndUpdate(eventId, {
        $inc: { registeredCount: 1 }
      });
    } catch (err) {
      console.error('[event][registerForEvent] Registered count update error:', err);
      // Don't block registration if this fails
    }

    res.json({
      success: true,
      message: 'Successfully registered for event',
      purchase
    });
  } catch (error) {
    console.error('[event][registerForEvent] Unexpected error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for event',
      error: error.message
    });
  }
};

// Get user's registered events
const getMyEvents = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      userId: req.user.id,
      status: 'completed',
      eventId: { $exists: true, $ne: null }
    }).populate({
      path: 'eventId',
      populate: [
        { path: 'instructor', select: 'name email' }
      ]
    });

    // Defensive: flatten and include all event fields, fallback to purchase._id if missing
    const events = purchases
      .map(purchase => {
        if (!purchase.eventId) return null;
        // Attach purchaseId for reference if needed
        return {
          ...purchase.eventId.toObject(),
          purchaseId: purchase._id,
          hasRegistered: true // for frontend convenience
        };
      })
      .filter(event => event);

    res.json({
      success: true,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching registered events',
      error: error.message
    });
  }
};

// Create event (admin only)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      duration,
      maxParticipants,
      price,
      instructor,
      videoUrl,
      imageUrl,
      materials,
      venue
    } = req.body;

    // Create a default instructor if not provided or invalid (admin user)
    let instructorId = instructor;
    if (!instructorId || instructorId.trim() === '' || !mongoose.Types.ObjectId.isValid(instructorId)) {
      // Use the admin user as default instructor
      const User = require('../models/User');
      const adminUser = await User.findOne({ email: 'admin@neonclub.com' });
      instructorId = adminUser ? adminUser._id : null;
    }


    // Always set thumbnail from imageUrl if not provided
    let thumb = req.body.thumbnail || imageUrl;
    if (thumb && !String(thumb).startsWith('/uploads')) {
      // Defensive: only use if it's a valid uploads path
      thumb = '';
    }

    const event = new Event({
      title,
      description,
      date: new Date(date),
      time: time || '10:00',
      duration: parseInt(duration) || 1,
      capacity: parseInt(maxParticipants) || 50,
      price: parseFloat(price) || 0,
      instructor: instructorId,
      videoUrl,
      imageUrl,
      thumbnail: thumb,
      venue: { name: venue || 'TBD' },
      materials: materials ? materials.split(',').map(m => m.trim()) : [],
      isActive: true
    });

    await event.save();

    // Emit real-time update
    try {
      emitNewEvent(event);
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Update event (admin only)
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    // Always set thumbnail from imageUrl if not provided
    if (!updateData.thumbnail && updateData.imageUrl) {
      if (String(updateData.imageUrl).startsWith('/uploads')) {
        updateData.thumbnail = updateData.imageUrl;
      }
    }

    const event = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Emit real-time update
    try {
      emitEventUpdate(event._id, 'updated', event);
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Delete event (admin only)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Emit real-time update
    try {
      emitEventUpdate(event._id, 'deleted', event);
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  registerForEvent,
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent
};