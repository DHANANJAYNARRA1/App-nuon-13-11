const User = require('../models/User');
const Mentor = require('../models/Mentor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, specialization, experience, location } = req.body;
    const userId = req.user._id || req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        specialization,
        experience: parseInt(experience) || 0,
        location,
        isProfileComplete: true
      },
      { new: true }
    );

    if (user.role === 'mentor') {
      await Mentor.findOneAndUpdate(
        { _id: userId },
        {
          name,
          specialization,
          experience: parseInt(experience) || 0,
          location
        }
      );
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        specialization: user.specialization,
        experience: user.experience,
        location: user.location,
        isProfileComplete: user.isProfileComplete,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
      console.error('Update profile error:', {
        error: error,
        stack: error.stack,
        body: req.body,
        user: req.user,
        headers: req.headers,
        path: req.path,
        method: req.method,
        time: new Date().toISOString()
      });
      res.status(500).json({
        success: false,
        message: 'Error updating profile',
        error: error.message
      });
  }
};

// Add Profile API
const createOrUpdateProfile = async (req, res) => {
  try {
    const { name, specialization, experience, location } = req.body;
    const userId = req.user._id || req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        specialization,
        experience: parseInt(experience) || 0,
        location,
        isProfileComplete: true
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
      console.error('Create/Update profile error:', {
        error: error,
        stack: error.stack,
        body: req.body,
        user: req.user,
        headers: req.headers,
        path: req.path,
        method: req.method,
        time: new Date().toISOString()
      });
      res.status(500).json({
        success: false,
        message: 'Error creating/updating profile',
        error: error.message
      });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
      console.error('Get profile error:', {
        error: error,
        stack: error.stack,
        params: req.params,
        user: req.user,
        headers: req.headers,
        path: req.path,
        method: req.method,
        time: new Date().toISOString()
      });
      res.status(500).json({
        success: false,
        message: 'Error getting profile',
        error: error.message
      });
  }
};

// Get current user profile
const getCurrentProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        specialization: user.specialization,
        experience: user.experience,
        organization: user.organization,
        city: user.city,
        state: user.state,
        location: user.location,
        isProfileComplete: user.isProfileComplete,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
      console.error('Get current profile error:', {
        error: error,
        stack: error.stack,
        user: req.user,
        headers: req.headers,
        path: req.path,
        method: req.method,
        time: new Date().toISOString()
      });
      res.status(500).json({
        success: false,
        message: 'Error getting current profile',
        error: error.message
      });
  }
};

// Login with email and password
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('[LOGIN] Attempting login for email:', email);
    console.log('[LOGIN] Client IP:', req.ip || req.connection.remoteAddress);
    console.log('[LOGIN] User-Agent:', req.headers['user-agent']);
    console.log('[LOGIN] Request origin:', req.headers.origin || 'none');

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('[LOGIN] User not found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.passwordHash) {
      console.log('[LOGIN] User has no password set:', user._id);
      return res.status(401).json({
        success: false,
        message: 'Account not fully registered. Please complete your profile first.'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      console.log('[LOGIN] Invalid password for user:', user._id);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user);
  console.log('[LOGIN] Login successful for user:', user._id, user.email);
  console.log('[LOGIN] JWT Token:', token);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        specialization: user.specialization,
        experience: user.experience,
        organization: user.organization,
        city: user.city,
        state: user.state,
        location: user.location,
        isProfileComplete: user.isProfileComplete,
        profilePicture: user.profilePicture
      },
      token
    });
  } catch (error) {
    console.error('Login error:', {
      error: error,
      stack: error.stack,
      body: req.body,
      headers: req.headers,
      path: req.path,
      method: req.method
    });
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// Mentor login
const mentorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    // Find mentor by email
    const mentor = await Mentor.findOne({ email });
    if (!mentor) {
      console.log('Mentor not found:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: mentor._id, role: 'mentor' }, process.env.JWT_SECRET, { expiresIn: '1d' });

    console.log('Login successful for:', email);
    res.json({ success: true, token });
  } catch (error) {
    console.error('Mentor login error:', error);
    res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
  }
};

// Legacy register (for backward compatibility)
const register = async (req, res) => {
  try {
    console.log('[REGISTRATION] Starting registration for:', { phoneNumber: req.body.phoneNumber, email: req.body.email });
    const { name, email, password, phoneNumber, specialization, experience, organization, city, state, location, role = 'nurse' } = req.body;

    // Check for existing user by phone number first (since OTP creates user with phone)
    const existingUserByPhone = await User.findOne({ phoneNumber: phoneNumber });

    if (existingUserByPhone) {
      console.log('[REGISTRATION] Found existing user by phone:', existingUserByPhone._id, existingUserByPhone.email);

      // If user already has complete profile, don't allow re-registration
      if (existingUserByPhone.isProfileComplete) {
        console.log('[REGISTRATION] User already has complete profile - blocking duplicate registration');
        return res.status(400).json({
          success: false,
          message: 'User already exists with this phone number. Please login instead.'
        });
      }

      // User exists but profile is incomplete (from OTP) - allow completion
      console.log('[REGISTRATION] Completing user profile from OTP verification');
      const updateData = {
        name,
        email: email ? email.toLowerCase() : existingUserByPhone.email,
        passwordHash: await bcrypt.hash(password, 10),
        specialization,
        experience: parseInt(experience) || 0,
        organization,
        city,
        state,
        location,
        isProfileComplete: true
      };

      console.log('[REGISTRATION] Update data:', updateData);
      const updatedUser = await User.findByIdAndUpdate(
        existingUserByPhone._id,
        updateData,
        { new: true }
      );

      console.log('[REGISTRATION] User profile completed successfully:', updatedUser._id, updatedUser.email, updatedUser.isProfileComplete);
      const token = generateToken(updatedUser);

      return res.status(200).json({
        success: true,
        message: 'Registration successful',
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          role: updatedUser.role,
          specialization: updatedUser.specialization,
          experience: updatedUser.experience,
          organization: updatedUser.organization,
          city: updatedUser.city,
          state: updatedUser.state,
          location: updatedUser.location,
          isProfileComplete: updatedUser.isProfileComplete,
          profilePicture: updatedUser.profilePicture
        },
        token
      });
    }

    console.log('[REGISTRATION] No existing user found by phone, checking email:', email);
    // No user with this phone number, check for existing user by email (if email provided)
    if (email) {
      const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingUserByEmail) {
        console.log('[REGISTRATION] Email already exists for different user:', existingUserByEmail._id);
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email address'
        });
      }
    }

    console.log('[REGISTRATION] Creating new user');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: email ? email.toLowerCase() : null,
      phoneNumber: phoneNumber,
      passwordHash: hashedPassword,
      role,
      specialization,
      experience: parseInt(experience) || 0,
      organization,
      city,
      state,
      location,
      isProfileComplete: true
    });

    await user.save();
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        specialization: user.specialization,
        experience: user.experience,
        organization: user.organization,
        city: user.city,
        state: user.state,
        location: user.location,
        isProfileComplete: user.isProfileComplete,
        profilePicture: user.profilePicture
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
};

module.exports = {
  login,
  register,
  updateProfile,
  getProfile,
  getCurrentProfile,
  generateToken,
  createOrUpdateProfile,
  mentorLogin
};