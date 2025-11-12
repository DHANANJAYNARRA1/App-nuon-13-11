const jwt = require('jsonwebtoken');
const User = require('../models/User');
const firebaseAdmin = require('../config/firebaseAdmin');
const logger = require('../lib/logger');

// Middleware supports two token types:
// 1) Firebase ID tokens (recommended) - verified via firebase-admin
// 2) Legacy JWT tokens signed by server - verified via process.env.JWT_SECRET
const auth = async (req, res, next) => {
  try {
    const raw = req.header('Authorization') || '';
    const token = raw.replace('Bearer ', '').trim();

    // Development bypass header: if running locally and client provided a matching
    // x-dev-bypass header, map it to an admin user. This is intentionally
    // permissive and should only be used in local development.
    if (!token && process.env.NODE_ENV !== 'production') {
      const devBypass = req.header('x-dev-bypass');
      if (devBypass) {
        // Compare to configured DEV_BYPASS_SECRET if provided, otherwise accept 'dev_secret'
        const expected = process.env.DEV_BYPASS_SECRET || 'dev_secret';
        if (devBypass === expected) {
          // Resolve admin user by configured email or fallback to first admin user
          const adminEmail = process.env.DEV_BYPASS_ADMIN_EMAIL || 'admin@neonclub.com';
          const adminUser = await User.findOne({ email: adminEmail }).select('-passwordHash');
          if (adminUser) {
            req.user = adminUser;
            return next();
          }
        }
      }
    }

    if (!token) {
      logger.warn('[auth] No Authorization header present');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Try Firebase verification first
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      // decodedToken contains uid, email, name, etc.
      // Find or create a user record linked to this firebase uid
      let user = await User.findOne({ firebaseUid: decodedToken.uid }).select('-passwordHash');
      if (!user) {
        // create minimal user profile
        user = await User.create({
          name: decodedToken.name || decodedToken.email || 'Firebase User',
          email: decodedToken.email || `${decodedToken.uid}@firebase.local`,
          firebaseUid: decodedToken.uid,
          role: 'nurse'
        });
      }

      req.user = user;
      return next();
    } catch (fbErr) {
      // Not a valid Firebase token or firebase not configured - fall through to JWT
      // debug logging commented out to reduce noise in deployments where firebase is disabled
      // logger.debug('[auth] Firebase token verification failed:', fbErr && fbErr.message ? fbErr.message : fbErr);
    }

    // Fallback: legacy JWT tokens
    try {
      const secret = process.env.JWT_SECRET || 'fallback_secret';
      const decoded = jwt.verify(token, secret);
      console.log('[auth] Decoded JWT:', decoded);
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) {
        console.warn('[auth] No user found for decoded id:', decoded.id);
        return res.status(401).json({ message: 'Token is not valid' });
      }
      console.log('[auth] User found for token:', user.email || user._id);
      req.user = user;
      return next();
    } catch (err) {
      // JWT verification failed - comment out debug log in production-like deployments
      // logger.debug('[auth] JWT verification failed:', err && err.message ? err.message : err);
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (error) {
      logger.error('[auth] Unexpected auth error:', {
        error: error,
        stack: error.stack,
        headers: req.headers,
        path: req.path,
        method: req.method,
        time: new Date().toISOString(),
        body: req.body,
        query: req.query
      });
      res.status(401).json({ message: 'Token is not valid' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    const userRoles = Array.isArray(roles[0]) ? roles[0] : roles;
    if (!req.user) {
      logger.warn('[authorize] Missing req.user when checking roles:', userRoles);
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!userRoles.includes(req.user.role)) {
      logger.warn(`[authorize] User role '${req.user.role}' not allowed for roles: ${userRoles}`);
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { auth, authorize, adminAuth };