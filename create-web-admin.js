const mysql = require('mysql2/promise');

const createWebAdmin = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sims@123',
    database: 'sims_nuonhub'
  });

  try {
    console.log('Connected to MySQL');

    const adminEmail = 'admin@nuonhub.com';
    const adminPasswordHash = '$2b$10$AEezC.K2e5goAj.v8FUoS.ZkJ9M5TOdxS15DTQ9anKZAfUArQroNW';

    // Delete existing admin user if exists
    await connection.execute('DELETE FROM users WHERE email = ?', [adminEmail]);
    console.log('Deleted existing admin user');

    // Ensure admin role exists
    let [roles] = await connection.execute('SELECT id FROM roles WHERE name = ?', ['admin']);
    if (roles.length === 0) {
      await connection.execute('INSERT INTO roles (name, active, created_at, updated_at) VALUES (?, 1, NOW(), NOW())', ['admin']);
      [roles] = await connection.execute('SELECT id FROM roles WHERE name = ?', ['admin']);
    }
    const roleId = roles[0].id;

    // Create new admin user with email and password only
    await connection.execute(
      'INSERT INTO users (email, password, role_id, active, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())',
      [adminEmail, adminPasswordHash, roleId]
    );

    console.log(`✅ Web Admin user created successfully: ${adminEmail}`);
    console.log(`🔑 Password: admin@123 (hashed)`);

    // Verify admin exists
    const [users] = await connection.execute('SELECT id, email, role_id FROM users WHERE email = ?', [adminEmail]);
    if (users.length > 0) {
      console.log(`🔍 Admin verification: Found user with ID ${users[0].id}, email ${users[0].email}, role_id ${users[0].role_id}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
};

createWebAdmin();