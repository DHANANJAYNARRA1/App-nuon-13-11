const mysql = require('mysql2/promise');

async function checkRole() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sims@123',
    database: 'sims_nuonhub'
  });

  try {
    const [roles] = await connection.execute('SELECT * FROM roles WHERE id = ?', [1]);
    console.log('Role with id 1:', roles);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkRole();