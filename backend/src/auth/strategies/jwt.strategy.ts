import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategyBase } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

/**
 * JWT strategy used for access token validation.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(JwtStrategyBase, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string; email: string; roles?: string[] }) {
    const user = await this.usersService.getById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token - user not found');
    }
    return {
      id: user.id,
      email: payload.email,
      roles: payload.role ? [payload.role as any] : [],
    } as any;
  }
}
