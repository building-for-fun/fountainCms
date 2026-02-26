import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

/**
 * Match client-side hashing: SHA-256 hex then bcrypt. Raw password never sent or stored.
 * If you had existing users with the old scheme (bcrypt(plain)), re-run this seed
 * so the admin user gets the new hash, or have users set a new password via Profile.
 */
function clientHashThenBcrypt(plainPassword: string): Promise<string> {
  const hex = crypto.createHash('sha256').update(plainPassword, 'utf8').digest('hex');
  return bcrypt.hash(hex, 10);
}

async function main() {
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

  const passwordHash = await clientHashThenBcrypt('password');

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
