const Workshop = require('../models/Workshop');
const Session = require('../models/Session');
const Purchase = require('../models/Purchase');
const mongoose = require('mongoose');

// Get all workshops (public)
const getAllWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find({ isPublished: true })
      .populate('mentors', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      workshops
    });
  } catch (error) {
    console.error('Error fetching workshops:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workshops',
      error: error.message
    });
  }
};

// Get workshop details with sessions
const getWorkshopById = async (req, res) => {
  try {
    const { workshopId } = req.params;
    const userId = req.user?.id;

    const workshop = await Workshop.findById(workshopId)
      .populate('mentors', 'name email');

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found'
      });
    }

    // Get associated sessions
    const sessions = await Session.find({ workshopId })
      .populate('mentors', 'name email')
      .sort({ startsAt: 1 });

    // Check if user has registered
    let hasRegistered = false;
    if (userId) {
      const purchase = await Purchase.findOne({
        userId,
        workshopId,
        status: 'completed'
      });
      hasRegistered = !!purchase;
    }

    res.json({
      success: true,
      workshop,
      sessions,
      hasRegistered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workshop',
      error: error.message
    });
  }
};

// Register for workshop (unified with course logic)
const registerForWorkshop = async (req, res) => {
  try {
    // Debug: Log incoming request
    console.log('--- REGISTER WORKSHOP REQUEST ---');
    console.log('req.body:', req.body);
    console.log('req.user:', req.user);

    // Get workshopId from params (URL), not body
    const workshopId = req.params.id;
    const { paymentId, paymentMethod } = req.body;
    console.log('Resolved workshopId:', workshopId);
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      console.log('Workshop not found for workshopId:', workshopId);
      return res.status(404).json({
        success: false,
        message: 'Workshop not found'
      });
    }
    console.log('Workshop found:', workshop.title, 'price:', workshop.price);

    // Check if already registered
    const existingPurchase = await Purchase.findOne({
      userId: req.user.id,
      workshopId
    });
    if (existingPurchase) {
      console.log('User already registered for this workshop:', req.user.id, workshopId);
      return res.status(400).json({
        success: false,
        message: 'Already registered for this workshop'
      });
    }

    // Use workshop price or 0 if free
    const price = typeof workshop.price === 'number' ? workshop.price : 0;
    let finalPaymentMethod = paymentMethod;
    let finalPaymentId = paymentId;
    if (price === 0) {
      finalPaymentMethod = 'free';
      finalPaymentId = 'free';
      console.log('Detected free workshop, setting paymentMethod/paymentId to free');
    }
    if (!finalPaymentMethod || !finalPaymentId) {
      console.log('Missing payment info:', finalPaymentMethod, finalPaymentId);
      return res.status(400).json({ success: false, message: 'Missing payment info' });
    }

    const purchase = new Purchase({
      userId: req.user.id,
      workshopId,
      amount: price,
      paymentMethod: finalPaymentMethod,
      paymentId: finalPaymentId,
      status: 'completed'
    });

    await purchase.save();
    console.log('Workshop purchase created successfully:', purchase._id);

    res.json({
      success: true,
      message: 'Successfully registered for workshop',
      purchase
    });
  } catch (error) {
    console.error('Workshop registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for workshop',
      error: error.message
    });
  }
};

// Get user's registered workshops (unified with new Purchase model)
const getMyWorkshops = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      userId: req.user.id,
      status: 'completed',
      workshopId: { $exists: true, $ne: null }
    }).populate({
      path: 'workshopId',
      populate: {
        path: 'mentors',
        select: 'name email'
      }
    });

    console.log('getMyWorkshops: purchases found:', purchases.length);
    purchases.forEach((p, i) => {
      console.log(`Purchase[${i}]:`, {
        purchaseId: p._id,
        workshopId: p.workshopId?._id,
        workshopTitle: p.workshopId?.title,
        workshop: p.workshopId
      });
    });

    // Add all relevant fields for frontend (title, description, videoUrl, startDate, mentors, etc.)
    // Only include purchases where the referenced workshop exists
    const workshops = purchases
      .map(purchase => purchase.workshopId)
      .filter(workshop => workshop && typeof workshop === 'object' && workshop._id)
      .map(workshop => {
        const w = workshop.toObject();
        return {
          _id: w._id,
          title: w.title,
          description: w.description,
          videoUrl: w.videoUrl || (w.metadata && w.metadata.videoUrl) || '',
          startDate: w.startDate || w.date || '',
          endDate: w.endDate || '',
          mentors: w.mentors || [],
          thumbnail: w.thumbnail || w.coverImage || w.imageUrl || '',
          coverImage: w.coverImage || '',
          imageUrl: w.imageUrl || '',
          price: w.price || 0,
          venue: w.venue || (w.metadata && w.metadata.venue) || {},
          metadata: w.metadata || {},
          isPublished: w.isPublished,
          createdAt: w.createdAt,
          updatedAt: w.updatedAt
        };
      });

    console.log('getMyWorkshops: workshops to return:', workshops.length, workshops.map(w => w.title));

    res.json({
      success: true,
      workshops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching registered workshops',
      error: error.message
    });
  }
};

// Get workshop materials
const getWorkshopMaterials = async (req, res) => {
  try {
    const { workshopId } = req.params;

    // Check if user has registered
    const purchase = await Purchase.findOne({
      userId: req.user.id,
      workshopId,
      status: 'completed'
    });

    if (!purchase) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Please register for this workshop first.'
      });
    }

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found'
      });
    }

    // Get sessions with materials
    const sessions = await Session.find({ workshopId })
      .select('title materials')
      .sort({ startsAt: 1 });

    res.json({
      success: true,
      workshop: {
        title: workshop.title,
        materials: workshop.metadata?.materials || []
      },
      sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workshop materials',
      error: error.message
    });
  }
};

// Create workshop (admin only)
const createWorkshop = async (req, res) => {
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

    const workshop = new Workshop({
      title,
      description,
      date: new Date(date),
      time: time || '10:00', // Default time if not provided
      duration: parseInt(duration) || 1, // Default 1 hour if not provided
      capacity: parseInt(maxParticipants) || 50,
      price: parseFloat(price) || 0,
      instructor: instructorId,
      videoUrl,
      imageUrl,
      venue: { name: venue || 'TBD' },
      materials: materials ? materials.split(',').map(m => m.trim()) : [],
      isActive: true
    });

    await workshop.save();

    res.status(201).json({
      success: true,
      message: 'Workshop created successfully',
      workshop
    });
  } catch (error) {
    console.error('Error creating workshop:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating workshop',
      error: error.message
    });
  }
};

// Update workshop (admin only)
const updateWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const workshop = await Workshop.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true
    });

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found'
      });
    }

    res.json({
      success: true,
      message: 'Workshop updated successfully',
      workshop
    });
  } catch (error) {
    console.error('Error updating workshop:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating workshop',
      error: error.message
    });
  }
};

// Delete workshop (admin only)
const deleteWorkshop = async (req, res) => {
  try {
    const { id } = req.params;

    const workshop = await Workshop.findByIdAndDelete(id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found'
      });
    }

    res.json({
      success: true,
      message: 'Workshop deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting workshop:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting workshop',
      error: error.message
    });
  }
};

module.exports = {
  getAllWorkshops,
  getWorkshopById,
  registerForWorkshop,
  getMyWorkshops,
  getWorkshopMaterials,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop
};