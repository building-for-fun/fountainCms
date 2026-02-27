import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

/** Default content types seeded when DB is empty. Schema is now DB-driven. */
const DEFAULT_CONTENT_TYPES: Array<{
  name: string;
  label: string | null;
  fields: Array<{ name: string; type: string; required: boolean; defaultValue?: unknown; options?: string[]; readonly?: boolean }>;
}> = [
  {
    name: 'posts',
    label: 'Posts',
    fields: [
      { name: 'title', type: 'string', required: true },
      { name: 'published', type: 'boolean', required: false, defaultValue: false },
    ],
  },
];

/**
 * Match client-side hashing: SHA-256 hex then bcrypt. Raw password never sent or stored.
 */
function clientHashThenBcrypt(plainPassword: string): Promise<string> {
  const hex = crypto.createHash('sha256').update(plainPassword, 'utf8').digest('hex');
  return bcrypt.hash(hex, 10);
}

async function seedSchema() {
  for (const collection of DEFAULT_CONTENT_TYPES) {
    const def = await prisma.contentTypeDefinition.upsert({
      where: { name: collection.name },
      update: { label: collection.label },
      create: { name: collection.name, label: collection.label },
    });

    for (const field of collection.fields) {
      await prisma.contentTypeField.upsert({
        where: {
          contentTypeDefId_name: { contentTypeDefId: def.id, name: field.name },
        },
        update: {
          type: field.type,
          required: field.required ?? false,
          defaultValue: field.defaultValue,
          options: field.options,
          readonly: field.readonly ?? false,
        },
        create: {
          contentTypeDefId: def.id,
          name: field.name,
          type: field.type,
          required: field.required ?? false,
          defaultValue: field.defaultValue,
          options: field.options,
          readonly: field.readonly ?? false,
        },
      });
    }
  }
}

async function main() {
  await seedSchema();

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
