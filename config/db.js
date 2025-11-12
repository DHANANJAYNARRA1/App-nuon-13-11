const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Set connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      bufferMaxEntries: 0,
      maxPoolSize: 10,
      minPoolSize: 5,
    };

    // Primary MongoDB URI
    let mongoURI = process.env.MONGODB_URI;
    
    // Fallback to localhost if no URI provided
    if (!mongoURI) {
      mongoURI = 'mongodb://localhost:27017/neonclub';
      console.log('⚠️  No MONGODB_URI found, using localhost fallback');
    }

    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI, options);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Try fallback connection if cloud fails
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb+srv')) {
      console.log('🔄 Trying localhost fallback...');
      try {
        const fallbackConn = await mongoose.connect('mongodb://localhost:27017/neonclub', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB Connected (fallback): ${fallbackConn.connection.host}`);
        return;
      } catch (fallbackError) {
        console.error('❌ Fallback connection also failed:', fallbackError.message);
      }
    }
    
    console.error('❌ Unable to connect to any MongoDB instance. Exiting...');
    process.exit(1);
  }
};

module.exports = connectDB;