import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { getAuthConfig, AuthConfig } from './auth.config';
import type { AppAuthUser, JwtPayload } from './auth.types';
import type { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly config: AuthConfig;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    this.config = getAuthConfig();
  }

  getConfig() {
    return this.config;
  }

  /** Validate local user by username/email and password; return app user or throw */
  async validateLocalUser(
    login: string,
    password: string,
  ): Promise<AppAuthUser> {
    const user = await this.prisma.user.findFirst({
      where: {
        isActive: true,
        OR: [{ email: login }, { username: login }],
      },
      include: { role: true },
    });
    const userWithHash = user as typeof user & { passwordHash?: string | null };
    if (!user || !userWithHash.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await bcrypt.compare(password, userWithHash.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.toAppAuthUser(user);
  }

  /** Find or create user from external identity (OAuth/SAML); return app user */
  async findOrCreateFromExternal(
    email: string,
    name: string,
    roleClaim: string | string[] | undefined,
  ): Promise<AppAuthUser> {
    let user = await this.prisma.user.findFirst({
      where: { email },
      include: { role: true },
    });
    const roleName = this.normalizeRoleClaim(roleClaim);
    const [firstName, ...lastParts] = (name || '').trim().split(/\s+/);
    const lastName = lastParts.join(' ') || firstName || '';

    if (user) {
      return this.toAppAuthUser(user);
    }
    const username = email.replace(/@.*/, '').replace(/\W/g, '_').toLowerCase();
    const uniqueUsername = await this.ensureUniqueUsername(username);
    let roleId: string | null = null;
    if (roleName) {
      const role = await this.prisma.role.findUnique({
        where: { name: roleName },
      });
      if (role) roleId = role.id;
    }
    user = await this.prisma.user.create({
      data: {
        email,
        firstName: firstName || 'User',
        lastName: lastName || '',
        username: uniqueUsername,
        isActive: true,
        roleId,
      },
      include: { role: true },
    });
    return this.toAppAuthUser(user);
  }

  private async ensureUniqueUsername(base: string): Promise<string> {
    let candidate = base;
    let n = 0;
    while (
      await this.prisma.user.findUnique({ where: { username: candidate } })
    ) {
      candidate = `${base}_${++n}`;
    }
    return candidate;
  }

  private normalizeRoleClaim(
    roleClaim: string | string[] | undefined,
  ): string | null {
    if (roleClaim == null) return null;
    if (Array.isArray(roleClaim)) {
      const first = roleClaim[0];
      return typeof first === 'string' ? first : null;
    }
    return typeof roleClaim === 'string' ? roleClaim : null;
  }

  toAppAuthUser(user: User & { role?: { name: string } | null }): AppAuthUser {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      roleName: user.role?.name ?? null,
    };
  }

  /** Issue JWT and return token string; cookie is set by controller */
  issueToken(appUser: AppAuthUser): string {
    const payload: JwtPayload = {
      sub: appUser.id,
      email: appUser.email,
      username: appUser.username,
      role: appUser.roleName,
    };
    return this.jwtService.sign(payload as object, {
      secret: this.config.jwt.secret,
      expiresIn: Number(process.env.JWT_EXPIRY_SECONDS) || 604800, // default 7 days in seconds
    });
  }

  /** Validate JWT and return payload or null */
  validateToken(token: string): JwtPayload | null {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.config.jwt.secret,
      });
      return payload;
    } catch {
      return null;
    }
  }

  getCookieName(): string {
    return this.config.jwt.cookieName;
  }

  getCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      path: '/',
    };
  }
}
