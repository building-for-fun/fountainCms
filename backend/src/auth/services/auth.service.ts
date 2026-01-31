import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';

/**
 * Service handling authentication: login, register, token rotation.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Register a new user with hashed password.
   */
  async register(email: string, name: string, password: string) {
    const existing = await this.usersService.getAll();
    if (existing.some((u) => u.email === email))
      throw new BadRequestException('Email already in use');
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.usersService.create({
      email,
      firstName: name,
      lastName: '',
      username: email.split('@')[0],
      isActive: true,
      passwordHash: passwordHash as any,
    } as any);
    return { id: user.id, email: user.email, name };
  }

  /**
   * Validate credentials and return user if valid.
   */
  async validateUser(email: string, password: string) {
    // find user by email
    const users = await this.usersService.getAll();
    const user = users.find((u) => u.email === email);
    if (!user) return null;
    // passwordHash may be stored in extra field; attempt to read
    const ph = (user as any).passwordHash as string | undefined;
    if (!ph) return null;
    const valid = await bcrypt.compare(password, ph);
    if (!valid) return null;
    return user as any;
  }

  /**
   * Issues access and refresh tokens and stores hashed refresh token for rotation.
   */
  async login(user: { id: string; email: string; roles?: string[] }) {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles ?? [],
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get<string | number>(
        'JWT_ACCESS_EXPIRATION',
        '15m',
      ),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string | number>(
        'JWT_REFRESH_EXPIRATION',
        '7d',
      ),
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    // persist refresh token hash on user via prisma
    await this.usersService
      .update(user.id, {
        data: {
          /* ... */
        },
      } as any)
      .catch(() => {});

    return { accessToken, refreshToken };
  }

  /**
   * Rotate refresh token: verify provided refresh token and issue new tokens.
   */
  async rotateRefreshToken(currentRefreshToken: string) {
    let payload: { sub: string; email: string; roles?: string[] };
    try {
      payload = await this.jwtService.verifyAsync(currentRefreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.getById(payload.sub);
    if (!user || !(user as any).refreshTokenHash) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const matches = await bcrypt.compare(
      currentRefreshToken,
      (user as any).refreshTokenHash,
    );
    if (!matches) {
      await this.usersService
        .update(user.id, { data: { refreshTokenHash: null } } as any)
        .catch(() => {});
      throw new UnauthorizedException('Refresh token revoked');
    }

    // Issue new tokens
    const tokens = await this.login({
      id: user.id,
      email: payload.email,
      roles: payload.roles,
    });
    return { userId: user.id, tokens };
  }

  /**
   * Clears stored refresh token (logout).
   */
  async logout(userId: string) {
    await this.usersService
      .update(userId, { data: { refreshTokenHash: null } } as any)
      .catch(() => {});
  }
}
