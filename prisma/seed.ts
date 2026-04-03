import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default owner account
  const hashedPassword = await bcrypt.hash('owner123', 10);

  const owner = await prisma.user.upsert({
    where: { email: 'owner@transport.com' },
    update: {},
    create: {
      name: 'Transport Owner',
      email: 'owner@transport.com',
      password: hashedPassword,
      role: 'OWNER',
      phone: '9876543210',
    },
  });

  console.log('Owner account created:', owner.email);
  console.log('  Email: owner@transport.com');
  console.log('  Password: owner123');
  console.log('');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
