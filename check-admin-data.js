const mysql = require('mysql2/promise');

async function checkAdminData() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Sims@123',
      database: 'sims_nuonhub'
    });
    console.log('🔍 Checking admin data in database...\n');

    // Check admin user
    const [users] = await conn.execute('SELECT * FROM users WHERE email = ?', ['admin@nuonhub.com']);

    if (users.length > 0) {
      console.log('✅ Admin user found:');
      console.log('Email:', users[0].email);
      console.log('Password (hashed):', users[0].password ? 'YES' : 'NO');
      console.log('Role ID:', users[0].role_id);
      console.log('Active:', users[0].active);
      console.log('Created:', users[0].created_at);
      console.log('Updated:', users[0].updated_at);
      console.log('\n📋 All fields:');
      console.table(users);
    } else {
      console.log('❌ Admin user not found');
    }

    conn.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkAdminData();