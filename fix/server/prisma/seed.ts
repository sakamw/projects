import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@test.com' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'user1@test.com',
      username: 'johndoe',
      password: await bcrypt.hash('password123', 10),
      verified: true,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@test.com' },
    update: {},
    create: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'user2@test.com',
      username: 'janesmith',
      password: await bcrypt.hash('password123', 10),
      verified: true,
    },
  });

  // Create test reports
  const report1 = await prisma.report.upsert({
    where: { id: 'report-1' },
    update: {},
    create: {
      id: 'report-1',
      userId: user1.id,
      title: 'Network connectivity issues',
      description: 'Experiencing intermittent network connectivity in the office area.',
      category: 'IT',
      status: 'PENDING',
    },
  });

  const report2 = await prisma.report.upsert({
    where: { id: 'report-2' },
    update: {},
    create: {
      id: 'report-2',
      userId: user2.id,
      title: 'Water leak in bathroom',
      description: 'There is a water leak coming from the faucet in the main bathroom.',
      category: 'SANITATION',
      status: 'IN_PROGRESS',
    },
  });

  const report3 = await prisma.report.upsert({
    where: { id: 'report-3' },
    update: {},
    create: {
      id: 'report-3',
      userId: user1.id,
      title: 'Security camera not working',
      description: 'The security camera in the parking lot is not recording footage.',
      category: 'SECURITY',
      status: 'RESOLVED',
    },
  });

  console.log('Seed data created successfully!');
  console.log('Users:', { user1: user1.email, user2: user2.email });
  console.log('Reports:', { report1: report1.title, report2: report2.title, report3: report3.title });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
