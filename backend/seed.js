const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seed() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin created successfully');
}

seed()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());