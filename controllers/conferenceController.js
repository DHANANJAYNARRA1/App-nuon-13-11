const Conference = require('../models/Conference');
const Purchase = require('../models/Purchase');
const mongoose = require('mongoose');
const { emitNewConference, emitConferenceUpdate } = require('../utils/socket');

// Get all conferences (public)
const getAllConferences = async (req, res) => {
  try {
    const conferences = await Conference.find({ isActive: true })
      .populate('instructor', 'name email')
      .sort({ date: 1 });

    // Defensive: ensure thumbnail is always present in the response
    const conferencesWithThumb = conferences.map(conf => {
      const obj = conf.toObject();
      if (!obj.thumbnail && obj.imageUrl) obj.thumbnail = obj.imageUrl;
      return obj;
    });

    res.json({
      success: true,
      conferences: conferencesWithThumb
    });
  } catch (error) {
    console.error('Error fetching conferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conferences',
      error: error.message
    });
  }
};

// Get conference details
const getConferenceById = async (req, res) => {
  try {
    const { conferenceId } = req.params;
    const userId = req.user?.id;

    const conference = await Conference.findById(conferenceId)
      .populate('instructor', 'name email');

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: 'Conference not found'
      });
    }

    // Check if user has registered
    let hasRegistered = false;
    if (userId) {
      const purchase = await Purchase.findOne({
        userId,
        conferenceId,
        status: 'completed'
      });
      hasRegistered = !!purchase;
    }

    res.json({
      success: true,
      conference,
      hasRegistered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conference',
      error: error.message
    });
  }
};

// Register for conference
const registerForConference = async (req, res) => {
  try {
    const conferenceId = req.params.id;
    const { paymentId, paymentMethod } = req.body;

    if (!conferenceId || !mongoose.Types.ObjectId.isValid(conferenceId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conference ID'
      });
    }

    const conference = await Conference.findById(conferenceId);
    if (!conference) {
      return res.status(404).json({
        success: false,
        message: 'Conference not found'
      });
    }

    // Check if already registered
    const existingPurchase = await Purchase.findOne({
      userId: req.user.id,
      conferenceId
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this conference'
      });
    }

    // Check capacity
    if (conference.capacity > 0 && conference.registeredCount >= conference.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Conference is full'
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
      conferenceId,
      amount: conference.price,
      paymentMethod,
      paymentId,
      status: 'completed'
    });

    try {
      await purchase.save();
    } catch (err) {
      console.error('[conference][registerForConference] Purchase save error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to save purchase',
        error: err.message
      });
    }

    // Update registered count
    try {
      await Conference.findByIdAndUpdate(conferenceId, {
        $inc: { registeredCount: 1 }
      });
    } catch (err) {
      console.error('[conference][registerForConference] Registered count update error:', err);
      // Don't block registration if this fails
    }

    res.json({
      success: true,
      message: 'Successfully registered for conference',
      purchase
    });
  } catch (error) {
    console.error('[conference][registerForConference] Unexpected error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for conference',
      error: error.message
    });
  }
};

// Get user's registered conferences
const getMyConferences = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      userId: req.user.id,
      status: 'completed',
      conferenceId: { $exists: true, $ne: null }
    }).populate({
      path: 'conferenceId',
      populate: [
        { path: 'instructor', select: 'name email' }
      ]
    });

    // Defensive: flatten and include all conference fields, fallback to purchase._id if missing
    const conferences = purchases
      .map(purchase => {
        if (!purchase.conferenceId) return null;
        // Attach purchaseId for reference if needed
        return {
          ...purchase.conferenceId.toObject(),
          purchaseId: purchase._id,
          hasRegistered: true // for frontend convenience
        };
      })
      .filter(conference => conference);

    res.json({
      success: true,
      conferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching registered conferences',
      error: error.message
    });
  }
};

// Create conference (admin only)
const createConference = async (req, res) => {
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

    const conference = new Conference({
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

    await conference.save();

    // Emit real-time update
    try {
      emitNewConference(conference);
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    res.status(201).json({
      success: true,
      message: 'Conference created successfully',
      conference
    });
  } catch (error) {
    console.error('Error creating conference:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating conference',
      error: error.message
    });
  }
};

// Update conference (admin only)
const updateConference = async (req, res) => {
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

    const conference = await Conference.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: 'Conference not found'
      });
    }

    // Emit real-time update
    try {
      emitConferenceUpdate(conference._id, 'updated', conference);
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    res.json({
      success: true,
      message: 'Conference updated successfully',
      conference
    });
  } catch (error) {
    console.error('Error updating conference:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating conference',
      error: error.message
    });
  }
};

// Delete conference (admin only)
const deleteConference = async (req, res) => {
  try {
    const { id } = req.params;

    const conference = await Conference.findByIdAndDelete(id);

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: 'Conference not found'
      });
    }

    // Emit real-time update
    try {
      emitConferenceUpdate(conference._id, 'deleted', conference);
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    res.json({
      success: true,
      message: 'Conference deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting conference:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting conference',
      error: error.message
    });
  }
};

module.exports = {
  getAllConferences,
  getConferenceById,
  registerForConference,
  getMyConferences,
  createConference,
  updateConference,
  deleteConference
};
