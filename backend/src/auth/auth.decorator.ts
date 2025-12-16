import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RefreshToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    const token = req.cookies?.refresh_token;

    if (typeof token !== 'string') {
      throw new Error('Refresh token missing');
    }

    return token;
  },
);
