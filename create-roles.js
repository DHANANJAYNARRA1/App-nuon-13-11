const mysql = require('mysql2/promise');

const createRoles = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sims@123',
    database: 'sims_nuonhub'
  });

  try {
    console.log('Connected to MySQL');

    const roles = ['admin', 'nurse', 'mentor'];

    for (const roleName of roles) {
      // Check if role exists
      const [existing] = await connection.execute('SELECT id FROM roles WHERE name = ?', [roleName]);
      if (existing.length === 0) {
        await connection.execute('INSERT INTO roles (name, active, created_at, updated_at) VALUES (?, 1, NOW(), NOW())', [roleName]);
        console.log(`✅ Role '${roleName}' created`);
      } else {
        console.log(`ℹ️ Role '${roleName}' already exists`);
      }
    }

    // Show all roles
    const [allRoles] = await connection.execute('SELECT * FROM roles');
    console.log('\n📋 All roles:');
    console.table(allRoles);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
};

createRoles();