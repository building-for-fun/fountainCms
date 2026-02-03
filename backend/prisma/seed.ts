import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

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

  const hashedPassword = await bcrypt.hash('*******8', 10);
  await prisma.user.upsert({
    where: { username: 'abc@gmail.com' },
    update: {},
    create: {
      username: 'abc@gmail.com',
      password: hashedPassword,
      role: { connect: { id: admin.id } },
      firstName: 'John',
      lastName: 'Doe',
      email: 'abc@gmail.com',
      isActive: false,
    },
  });
  await prisma.$disconnect();
}

main().catch(async (e) => {
  await prisma.$disconnect();
});
