const axios = require('axios');
(async()=>{
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@neonclub.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const login = await axios.post('http://localhost:5000/api/login',{email: adminEmail, password: adminPass});
    const token = login.data.token;
    console.log('Token retrieved successfully'); // Simplified log
    const resp = await axios.get('http://localhost:5000/api/admin/workshops', { headers: { Authorization: `Bearer ${token}` } });
    console.log('Workshops data fetched successfully'); // Simplified log
  } catch (e) {
    console.error('Error occurred:', e.response ? e.response.data : e.message); // Simplified error log
  }
})();
