import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';

/**
 * Custom strategy to validate refresh tokens from httpOnly cookies and support rotation.
 */
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly config: ConfigService,
  ) {
    super();
  }

  async validate(req: Request) {
    const token = (req as any).cookies?.refreshToken;
    if (!token) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    let payload: { sub: string; email: string; jti?: string };
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.getById(payload.sub);
    if (!user || !(user as any).refreshTokenHash) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const matches = await bcrypt.compare(token, (user as any).refreshTokenHash);
    if (!matches) {
      // possible token reuse - revoke all sessions
      await this.usersService
        .update(user.id, { data: { refreshTokenHash: null } } as any)
        .catch(() => {});
      throw new UnauthorizedException('Refresh token revoked or rotated');
    }

    return { id: user.id, email: payload.email } as any;
  }
}
