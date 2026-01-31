import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

/**
 * Service to create and validate Personal Access Tokens (PATs).
 */
@Injectable()
export class PatService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a PAT for a user. Returns the plain token once (never stored).
   */
  async create(userId: string, name = 'pat') {
    const raw = crypto.randomBytes(32).toString('hex');
    const token = `pat_${raw}`;
    const tokenHash = await bcrypt.hash(token, 12);

    const saved = await this.prisma.personalAccessToken
      .create({
        data: { userId, name, tokenHash },
      })
      .catch(() => {
        throw new ConflictException('Unable to create PAT');
      });

    return { token, tokenId: saved.id };
  }

  /**
   * Validate a PAT (raw token) and return associated user id.
   */
  async validate(token: string): Promise<string> {
    if (!token.startsWith('pat_'))
      throw new NotFoundException('Invalid PAT format');

    const pats = await this.prisma.personalAccessToken.findMany();
    for (const p of pats) {
      const match = await bcrypt.compare(token, p.tokenHash);
      if (match) return p.userId;
    }
    throw new NotFoundException('PAT not found');
  }

  /**
   * Revoke a PAT by id.
   */
  async revoke(tokenId: string, userId: string): Promise<void> {
    const pat = await this.prisma.personalAccessToken.findUnique({
      where: { id: tokenId },
    });
    if (!pat) throw new NotFoundException('PAT not found');
    if (pat.userId !== userId)
      throw new NotFoundException('PAT not owned by user');
    await this.prisma.personalAccessToken.delete({ where: { id: tokenId } });
  }
}
