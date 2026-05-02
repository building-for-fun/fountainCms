import type { JwtPayload } from '../auth/auth.types';

declare module 'express-serve-static-core' {
  interface Request {
    anonymousContentRead?: boolean;
    user?: JwtPayload;
  }
}

export {};
