const mysql = require('mysql2/promise');

async function checkAdmin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sims@123',
    database: 'sims_nuonhub'
  });

  try {
    const [users] = await connection.execute(
      'SELECT u.id, u.name, u.email, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.email = ?',
      ['admin@neonclub.com']
    );

    if (users.length > 0) {
      console.log('✅ Admin user exists:', users[0]);
    } else {
      console.log('❌ Admin user not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkAdmin();