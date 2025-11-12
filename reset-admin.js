const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const resetAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@neonclub.com';
    const adminPassword = 'admin123';

    // Delete existing admin user if exists
    await User.deleteMany({ email: adminEmail });
    console.log('Deleted existing admin user');

    // Create new admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new User({
      name: 'System Administrator',
      email: adminEmail,
      passwordHash: hashedPassword,
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log(`✅ Admin user created successfully: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    
    // Test the password
    const testUser = await User.findOne({ email: adminEmail });
    const isValidPassword = await bcrypt.compare(adminPassword, testUser.passwordHash);
    console.log(`🔍 Password test: ${isValidPassword ? 'PASS' : 'FAIL'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetAdmin();