const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Configure Twilio (for SMS OTP)
const twilioClient = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Configure Nodemailer (for email OTP)
let emailTransporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  try {
    emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } catch (error) {
    console.warn('Failed to create email transporter:', error.message);
    emailTransporter = null;
  }
} else {
  console.warn('Email transporter not configured: Missing credentials');
  emailTransporter = null;
}

// In-memory OTP storage (use Redis in production for scalability)
const otpStore = new Map();

// Rate limiting for OTP requests (basic implementation)
const otpRequestLimits = new Map();
const MAX_OTP_REQUESTS_PER_HOUR = 10;
const MAX_OTP_REQUESTS_PER_DAY = 50;

// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Check rate limits
const checkRateLimit = (identifier) => {
  const now = Date.now();
  const key = `limit:${identifier}`;
  const userLimits = otpRequestLimits.get(key) || {
    hourly: { count: 0, resetTime: now + (60 * 60 * 1000) },
    daily: { count: 0, resetTime: now + (24 * 60 * 60 * 1000) }
  };

  // Reset counters if time has passed
  if (now > userLimits.hourly.resetTime) {
    userLimits.hourly = { count: 0, resetTime: now + (60 * 60 * 1000) };
  }
  if (now > userLimits.daily.resetTime) {
    userLimits.daily = { count: 0, resetTime: now + (24 * 60 * 60 * 1000) };
  }

  // Check limits
  if (userLimits.hourly.count >= MAX_OTP_REQUESTS_PER_HOUR) {
    return { allowed: false, message: 'Too many OTP requests. Please try again in an hour.' };
  }
  if (userLimits.daily.count >= MAX_OTP_REQUESTS_PER_DAY) {
    return { allowed: false, message: 'Daily OTP request limit exceeded. Please try again tomorrow.' };
  }

  // Increment counters
  userLimits.hourly.count++;
  userLimits.daily.count++;
  otpRequestLimits.set(key, userLimits);

  return { allowed: true };
};

// Send SMS OTP
const sendSMSOTP = async (phoneNumber, otp) => {
  try {
    console.log(`Sending OTP to ${phoneNumber} with Twilio...`);
    await twilioClient.messages.create({
      body: `Your NeonClub verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    console.log(`OTP sent successfully to ${phoneNumber}`);
    return true;
  } catch (error) {
    console.error('SMS OTP send error:', error);
    return false;
  }
};

// Send Email OTP
const sendEmailOTPToUser = async (email, otp) => {
  try {
    // For development/testing, just log the OTP instead of sending email
    console.log(`[DEV MODE] Email OTP for ${email}: ${otp}`);

    // In production, send actual email if transporter is configured
    if (emailTransporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'NeonClub Email Verification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00FFFF;">NeonClub Email Verification</h2>
            <p>Your verification code is:</p>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 10px;">
            ${otp}
            </div>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        `
      });
    }

    return true;
  } catch (error) {
    console.error('Email OTP send error:', error);
    return false;
  }
};

// Send OTP for phone number
const sendPhoneOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    // Check rate limits
    const rateLimitCheck = checkRateLimit(phoneNumber);
    if (!rateLimitCheck.allowed) {
      return res.status(429).json({
        success: false,
        message: rateLimitCheck.message
      });
    }

    // Always use dummy OTP for now (as requested)
    const otp = '123456';
    const expiresAt = Date.now() + (5 * 60 * 1000); // 5 minutes

    // Store OTP
    otpStore.set(`phone:${phoneNumber}`, {
      otp,
      expiresAt,
      attempts: 0
    });

    console.log(`[DUMMY MODE] Phone OTP for ${phoneNumber}: ${otp}`);
    return res.json({
      success: true,
      message: 'OTP sent successfully to your phone number',
      expiresIn: 300 // seconds
    });
  } catch (error) {
    console.error('Send phone OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
};

// Send OTP for email
const sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check rate limits
    const rateLimitCheck = checkRateLimit(email.toLowerCase());
    if (!rateLimitCheck.allowed) {
      return res.status(429).json({
        success: false,
        message: rateLimitCheck.message
      });
    }

    // Always use dummy OTP for now (as requested)
    const otp = '123456';
    const expiresAt = Date.now() + (5 * 60 * 1000); // 5 minutes

    // Store OTP
    otpStore.set(`email:${email.toLowerCase()}`, {
      otp,
      expiresAt,
      attempts: 0
    });

    console.log(`[DUMMY MODE] Email OTP for ${email}: ${otp}`);
    return res.json({
      success: true,
      message: 'OTP sent successfully to your email',
      expiresIn: 300 // seconds
    });
  } catch (error) {
    console.error('Send email OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
};

// Verify OTP and authenticate user
const verifyOTP = async (req, res) => {
  try {
    const { identifier, otp, type } = req.body; // identifier: phone or email, type: 'phone' or 'email'

    console.log('[OTP VERIFY] Incoming:', { identifier, otp, type });
    console.log('[OTP VERIFY] Request headers:', req.headers);
    console.log('[OTP VERIFY] Request IP:', req.ip || req.connection.remoteAddress);

    if (!identifier || !otp || !type) {
      return res.status(400).json({
        success: false,
        message: 'Identifier, OTP, and type are required'
      });
    }

    const key = `${type}:${identifier}`;
    console.log('[OTP VERIFY] Looking for key:', key);
    console.log('[OTP VERIFY] All stored keys:', Array.from(otpStore.keys()));

    // Always use dummy OTP for testing - bypass storage check
    const storedData = {
      otp: '123456',
      expiresAt: Date.now() + (5 * 60 * 1000),
      attempts: 0
    };

    console.log('[OTP VERIFY] Using dummy OTP for testing');

    // Check if OTP has expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(key);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check attempts (max 3)
    if (storedData.attempts >= 3) {
      otpStore.delete(key);
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts += 1;
      otpStore.set(key, storedData);

      // Provide helpful error message based on attempts
      const remainingAttempts = 3 - storedData.attempts;
      const message = remainingAttempts > 0
        ? `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`
        : 'Invalid OTP. No attempts remaining.';

      console.log('[OTP VERIFY] OTP mismatch:', { expected: storedData.otp, got: otp, attempts: storedData.attempts });
      console.log('[OTP VERIFY] Network error context:', {
        userAgent: req.headers['user-agent'],
        origin: req.headers.origin,
        referer: req.headers.referer,
        connection: req.headers.connection
      });

      return res.status(400).json({
        success: false,
        message
      });
    }

    // OTP verified successfully
    otpStore.delete(key);
    console.log('[OTP VERIFY] OTP verified for', key);

    // Check if user exists
    let user;
    if (type === 'phone') {
      user = await User.findOne({ phoneNumber: identifier });
    } else {
      user = await User.findOne({ email: identifier.toLowerCase() });
    }

    let isNewUser = false;
    if (!user) {
      // Create new user, never set email at all for phone-only users
      let userData;
      if (type === 'email') {
        userData = {
          name: identifier.split('@')[0],
          email: identifier.toLowerCase(),
          role: 'nurse'
        };
      } else {
        // For phone-only users, create user data without email field
        userData = {
          name: `Nurse ${identifier.slice(-4)}`,
          phoneNumber: identifier,
          role: 'nurse'
        };
        // Don't set email field at all
      }
      // Use direct database insert to avoid Mongoose setting email to null
      const result = await User.collection.insertOne(userData);
      user = await User.findById(result.insertedId);
      isNewUser = true;
    }

    // Generate JWT token (you'll need to implement this)
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'OTP verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profilePicture: user.profilePicture
      },
      token,
      isNewUser
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    console.error('[OTP VERIFY] Network error details:', {
      error: error.message,
      stack: error.stack,
      headers: req.headers,
      body: req.body,
      ip: req.ip || req.connection.remoteAddress
    });
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

// Helper function to generate JWT (import from authController)
const { generateToken } = require('./authController');

module.exports = {
  sendPhoneOTP,
  sendEmailOTP,
  verifyOTP
};