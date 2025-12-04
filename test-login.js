const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function testLogin() {
  const prisma = new PrismaClient();

  try {
    const email = 'admin@nuonhub.com';
    const password = 'admin@123';

    console.log('Testing login for:', email);

    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() }
    });

    console.log('User found:', !!user);
    if (user) {
      console.log('User email:', user.email);
      console.log('Has password:', !!user.password);

      if (!user.password) {
        console.log('No password set');
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isValidPassword);

      if (!isValidPassword) {
        console.log('Invalid password');
        return;
      }

      console.log('Login should succeed');
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();