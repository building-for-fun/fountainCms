import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const TOKEN_PREFIX = 'fcm_';

export interface ApiTokenRecord {
  id: string;
  name: string;
  permissions: string[];
  expiresAt: Date | null;
  createdAt: Date;
}

function hashToken(plain: string): string {
  return createHash('sha256').update(plain, 'utf8').digest('hex');
}

@Injectable()
export class ApiTokensService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the raw secret once (for the client). Store only tokenHash in DB.
   */
  async create(
    name: string,
    permissions: string[],
    expiresAt?: Date | null,
  ): Promise<{ plainToken: string; token: ApiTokenRecord }> {
    const secret = randomBytes(32).toString('hex');
    const plainToken = `${TOKEN_PREFIX}${secret}`;
    const tokenHash = hashToken(plainToken);

    const row = await this.prisma.apiToken.create({
      data: {
        name,
        tokenHash,
        permissions,
        expiresAt: expiresAt ?? null,
      },
    });

    return {
      plainToken,
      token: {
        id: row.id,
        name: row.name,
        permissions: row.permissions,
        expiresAt: row.expiresAt,
        createdAt: row.createdAt,
      },
    };
  }

  async findAll(): Promise<ApiTokenRecord[]> {
    const rows = await this.prisma.apiToken.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      permissions: r.permissions,
      expiresAt: r.expiresAt,
      createdAt: r.createdAt,
    }));
  }

  async revoke(id: string): Promise<boolean> {
    const res = await this.prisma.apiToken.deleteMany({ where: { id } });
    return res.count > 0;
  }

  /**
   * Resolve a plain token to permissions if valid and not expired.
   */
  async validatePlainToken(
    plain: string,
  ): Promise<{ id: string; permissions: string[] } | null> {
    const trimmed = plain.trim();
    if (!trimmed.startsWith(TOKEN_PREFIX)) {
      return null;
    }
    const tokenHash = hashToken(trimmed);
    const row = await this.prisma.apiToken.findUnique({
      where: { tokenHash },
    });
    if (!row) return null;
    if (row.expiresAt && row.expiresAt.getTime() < Date.now()) {
      return null;
    }
    return { id: row.id, permissions: row.permissions };
  }
}
