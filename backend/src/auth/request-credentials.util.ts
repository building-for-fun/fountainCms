import type { Request } from 'express';
import { getAuthConfig } from './auth.config';

export function extractBearerToken(req: Request): string | undefined {
  const auth = req.headers.authorization;
  if (!auth || typeof auth !== 'string') return undefined;
  const [type, ...rest] = auth.split(/\s+/);
  const token = rest.join(' ');
  if (type?.toLowerCase() !== 'bearer' || !token) return undefined;
  return token;
}

export function extractJwtFromCookie(req: Request): string | undefined {
  const cookieName = getAuthConfig().jwt.cookieName;
  const cookies = req.cookies as Record<string, unknown> | undefined;
  const cookie = cookies?.[cookieName];
  return typeof cookie === 'string' ? cookie : undefined;
}

/** JWT-shaped bearer token (three dot-separated segments). */
export function looksLikeJwt(token: string): boolean {
  const parts = token.split('.');
  return parts.length === 3 && parts.every((p) => p.length > 0);
}

export function extractApiKeyHeader(req: Request): string | undefined {
  const raw = req.headers['x-api-key'];
  if (typeof raw === 'string' && raw.trim()) return raw.trim();
  if (Array.isArray(raw) && raw[0]?.trim()) return raw[0].trim();
  return undefined;
}
