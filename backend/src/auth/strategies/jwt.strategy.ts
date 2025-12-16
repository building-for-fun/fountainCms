import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies?.access_token,
      ]),
      secretOrKey: process.env.JWT_ACCESS_SECRET || '',
    });
  }

  validate(payload: any) {
    return { userId: payload.sub };
  }
}
