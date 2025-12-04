const axios = require('axios');

async function testAdminLogin() {
    try {
        console.log('Testing admin login...');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@nuonhub.com',
            password: 'admin@123'
        });

        console.log('✅ Login successful!');
        console.log('Response:', response.data);
    } catch (error) {
        console.log('❌ Login failed:', error.response?.data || error.message);
    }
}

testAdminLogin();