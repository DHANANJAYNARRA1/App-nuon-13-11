const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Test upload endpoint
const testUpload = async () => {
  try {
    // First login to get a token
    console.log('🔑 Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@neonclub.com',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');

    // Test the upload endpoint
    console.log('📁 Testing upload endpoint...');
    const response = await axios.get('http://localhost:5000/api/admin/upload', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Upload endpoint accessible');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testUpload();