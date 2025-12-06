const Payment = require('../models/Payment');
const { getSocket } = require('../utils/socket');

const initiatePayment = async (req, res) => {
  try {
    const { itemId, amount, gateway } = req.body;

    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const payment = await Payment.create({
      userId: req.user._id,
      itemId,
      amount,
      gateway,
      transactionId,
      status: 'pending'
    });

    const populatedPayment = await Payment.findById(payment._id)
      .populate('userId', 'name email')
      .populate('itemId', 'title type');

    try {
      const io = getSocket();
      if (io) io.emit('notification', { type: 'payment:initiated', payment: populatedPayment });
    } catch (e) {
  const logger = require('../lib/logger');
  logger.warn('paymentController: socket emit failed', e.message);
    }

    res.status(201).json(populatedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const initiateMentorshipPayment = async (req, res) => {
  try {
    const { mentorId, amount, originalAmount, coupon, paymentMethod, dateTime } = req.body;

    const transactionId = `MENTOR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const payment = await Payment.create({
      userId: req.user._id,
      mentorId,
      amount,
      originalAmount,
      coupon,
      paymentMethod,
      transactionId,
      status: 'completed', // Simulate successful payment for demo
      type: 'mentorship',
      dateTime
    });

    const populatedPayment = await Payment.findById(payment._id)
      .populate('userId', 'name email')
      .populate('mentorId', 'name email specialization');

    try {
      const io = getSocket();
      if (io) io.emit('notification', { type: 'mentorship_payment:completed', payment: populatedPayment });
    } catch (e) {
  const logger = require('../lib/logger');
  logger.warn('paymentController: mentorship payment socket emit failed', e.message);
    }

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      paymentId: payment._id,
      transactionId,
      payment: populatedPayment
    });
  } catch (error) {
    console.error('Mentorship payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    const targetUserId = userId || req.user._id;

    const payments = await Payment.find({ userId: targetUserId })
      .populate('itemId', 'title type')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email')
     .populate('itemId', 'title type');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    try {
      const io = getSocket();
      if (io) io.emit('notification', { type: 'payment:updated', payment });
    } catch (e) {
  const logger = require('../lib/logger');
  logger.warn('paymentController: socket emit failed', e.message);
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  initiatePayment,
  initiateMentorshipPayment,
  getPaymentHistory,
  updatePaymentStatus
};