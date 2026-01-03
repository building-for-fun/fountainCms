import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator role',
      permissions: ['*'],
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Default user role',
      permissions: ['read'],
    },
  });

  await prisma.user.upsert({
    where: { user: 'admin' },
    update: {},
    create: {
      user: 'admin',
      collection: '',
      layout: 'default',
      refresh_interval: null,
      icon: 'user',
      color: null,
      role: { connect: { id: admin.id } },
    },
  });

  await prisma.content.createMany({
    data: [
      { title: 'Welcome', body: 'Welcome to FountainCMS' },
      { title: 'Getting Started', body: 'Follow the docs to get started' },
    ],
  });

  await prisma.$disconnect();
}

main().catch(async (e) => {
  await prisma.$disconnect();
  process.exit(1);
});
