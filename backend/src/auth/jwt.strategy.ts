import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';
import type { JwtPayload } from './auth.types';
import { getAuthConfig } from './auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    const config = getAuthConfig();
    super({
      jwtFromRequest: (req: Request) => {
        const cookieName = config.jwt.cookieName;
        const cookie = req?.cookies?.[cookieName];
        if (cookie) return cookie;
        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
