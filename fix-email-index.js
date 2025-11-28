const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function fixEmailIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neonclub');

    console.log('Connected to MongoDB');

    // Remove email field from documents where email is null
    const result = await User.updateMany(
      { email: null },
      { $unset: { email: '' } }
    );

    console.log(`Updated ${result.modifiedCount} documents`);

    // Drop the existing email index if it exists
    try {
      await mongoose.connection.db.collection('users').dropIndex('email_1');
      console.log('Dropped email_1 index');
    } catch (error) {
      console.log('email_1 index not found or already dropped');
    }

    // Create new sparse unique index
    await mongoose.connection.db.collection('users').createIndex(
      { email: 1 },
      { unique: true, sparse: true }
    );

    console.log('Created new sparse unique index on email');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

fixEmailIndex();