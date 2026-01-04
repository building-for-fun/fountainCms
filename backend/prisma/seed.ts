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

  await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Default user role',
      permissions: ['read'],
    },
  });

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      role: { connect: { id: admin.id } },
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      isActive: false,
    },
  });
  await prisma.$disconnect();
}

main().catch(async (e) => {
  await prisma.$disconnect();
});
