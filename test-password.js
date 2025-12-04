const bcrypt = require('bcryptjs');

const hashedPassword = '$2b$10$qXgQcd9uNWukrEaPELdqAuhHuPF7AUU3nM6XlxuhXZ9O7LiWUEcsu';
const plainPassword = 'admin@123';

bcrypt.compare(plainPassword, hashedPassword).then(isValid => {
  console.log('Password match:', isValid);
}).catch(err => {
  console.error('Error:', err);
});