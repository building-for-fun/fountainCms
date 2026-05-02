import { createHmac, timingSafeEqual } from 'node:crypto';

const SIG_QUERY_KEYS = ['fit', 'format', 'h', 'q', 'w'] as const;

function firstQueryValue(
  query: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const v = query[key];
  if (Array.isArray(v)) return v[0];
  if (v === undefined || v === null) return undefined;
  return String(v);
}

/** Sorted transform params only (excludes exp/sig). */
export function canonicalTransformQueryForSig(
  query: Record<string, string | string[] | undefined>,
): string {
  const parts: string[] = [];
  for (const k of SIG_QUERY_KEYS) {
    const v = firstQueryValue(query, k);
    if (v !== undefined && v !== '') parts.push(`${k}=${v}`);
  }
  return parts.join('&');
}

export function signMediaFileRequest(
  mediaId: string,
  exp: number,
  query: Record<string, string | string[] | undefined>,
  secret: string,
): string {
  const canon = canonicalTransformQueryForSig(query);
  const msg = `${mediaId}|${exp}|${canon}`;
  return createHmac('sha256', secret).update(msg).digest('hex');
}

export function verifyMediaFileRequest(
  mediaId: string,
  query: Record<string, string | string[] | undefined>,
  secret: string,
): boolean {
  const expStr = firstQueryValue(query, 'exp');
  const sig = firstQueryValue(query, 'sig');
  if (!expStr || !sig) return false;
  const exp = parseInt(expStr, 10);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000))
    return false;
  const expected = signMediaFileRequest(mediaId, exp, query, secret);
  try {
    const a = Buffer.from(sig, 'hex');
    const b = Buffer.from(expected, 'hex');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
