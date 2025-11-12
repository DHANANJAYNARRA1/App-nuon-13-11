const axios = require('axios');

const testBackend = async () => {
  try {
    console.log('Testing backend connection...');
    
    // Test basic connection
    const response = await axios.get('http://localhost:5000/api/test', {
      timeout: 5000
    });
    console.log('✓ Backend is running');
    
    // Test registration
    const testUser = {
      name: 'Test Nurse',
      email: 'test@nurse.com',
      password: 'test123',
      role: 'nurse'
    };
    
    try {
      const registerResponse = await axios.post('http://localhost:5000/api/register', testUser);
      console.log('✓ Registration endpoint working');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log('✓ Registration endpoint working (user exists)');
      } else {
        console.log('✗ Registration error:', error.response?.data?.message || error.message);
      }
    }
    
    // Test login
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/login', {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✓ Login endpoint working');
      console.log('✓ JWT token received');
    } catch (error) {
      console.log('✗ Login error:', error.response?.data?.message || error.message);
    }
    
  } catch (error) {
    console.log('✗ Backend connection failed:', error.message);
    console.log('Make sure backend server is running on port 5000');
  }
};

testBackend();