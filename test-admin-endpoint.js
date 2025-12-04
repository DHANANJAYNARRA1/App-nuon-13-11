const axios = require('axios');

async function testAdminEndpoint() {
    try {
        // First login as admin
        console.log('🔐 Logging in as admin...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@nuonhub.com',
            password: 'admin@123'
        });

        const token = loginResponse.data.accessToken;
        console.log('✅ Login successful, token received');

        // Test the users endpoint with mentor role filter
        console.log('📋 Testing GET /api/admin/users?role=mentor...');
        const usersResponse = await axios.get('http://localhost:5000/api/admin/users?role=mentor', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('✅ Users endpoint successful');
        console.log('Response:', JSON.stringify(usersResponse.data, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.response ? error.response.data : error.message);
    }
}

testAdminEndpoint();