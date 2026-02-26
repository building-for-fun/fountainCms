import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

  const superAdmin = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      description: 'Super administrator role',
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

  const passwordHash = await bcrypt.hash('password', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { passwordHash, isActive: true, roleId: superAdmin.id } as Parameters<typeof prisma.user.upsert>[0]['update'],
    create: {
      username: 'admin',
      role: { connect: { id: superAdmin.id } },
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      isActive: true,
      passwordHash,
    } as Parameters<typeof prisma.user.upsert>[0]['create'],
  });
  await prisma.$disconnect();
}

main().catch(async (e) => {
  await prisma.$disconnect();
});
