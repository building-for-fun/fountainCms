import { createHash } from 'node:crypto';
import { BadRequestException } from '@nestjs/common';
/** Sharp is CJS-only; default import becomes `.default` at runtime without esModuleInterop. */
import sharp = require('sharp');

export type FitMode = 'cover' | 'contain' | 'inside' | 'fill';

export interface ParsedImageTransform {
  width?: number;
  height?: number;
  fit: FitMode;
  /** Output format; when omitted, preserves original image type where possible. */
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  quality: number;
}

function firstQueryValue(
  query: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const v = query[key];
  if (Array.isArray(v)) return v[0];
  if (v === undefined || v === null) return undefined;
  return String(v);
}

function parsePositiveDim(
  raw: string | undefined,
  name: string,
  maxEdge: number,
): number | undefined {
  if (raw === undefined || raw === '') return undefined;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) {
    throw new BadRequestException(`${name} must be a positive integer`);
  }
  if (n > maxEdge) {
    throw new BadRequestException(`${name} must be at most ${maxEdge}`);
  }
  return n;
}

function parseFit(raw: string | undefined): FitMode {
  if (!raw?.trim()) return 'cover';
  const v = raw.trim().toLowerCase();
  if (v === 'cover' || v === 'contain' || v === 'inside' || v === 'fill') {
    return v;
  }
  throw new BadRequestException(
    `fit must be cover, contain, inside, or fill (got ${raw})`,
  );
}

function parseFormat(
  raw: string | undefined,
): 'jpeg' | 'png' | 'webp' | 'avif' | undefined {
  if (!raw?.trim()) return undefined;
  const v = raw.trim().toLowerCase();
  if (v === 'jpg' || v === 'jpeg') return 'jpeg';
  if (v === 'png') return 'png';
  if (v === 'webp') return 'webp';
  if (v === 'avif') return 'avif';
  throw new BadRequestException(
    `format must be jpeg, png, webp, or avif (got ${raw})`,
  );
}

function parseQuality(raw: string | undefined): number {
  if (raw === undefined || raw === '') return 80;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1 || n > 100) {
    throw new BadRequestException('q must be between 1 and 100');
  }
  return n;
}

/**
 * Returns null when no transform/re-encode is requested.
 */
export function parseMediaTransformQuery(
  query: Record<string, string | string[] | undefined>,
  maxEdge: number,
): ParsedImageTransform | null {
  const w = parsePositiveDim(firstQueryValue(query, 'w'), 'w', maxEdge);
  const h = parsePositiveDim(firstQueryValue(query, 'h'), 'h', maxEdge);
  const format = parseFormat(firstQueryValue(query, 'format'));
  const fit = parseFit(firstQueryValue(query, 'fit'));
  const quality = parseQuality(firstQueryValue(query, 'q'));

  if (!w && !h && !format) return null;

  return { width: w, height: h, fit, format, quality };
}

function mimeForFormat(f: 'jpeg' | 'png' | 'webp' | 'avif'): string {
  switch (f) {
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'avif':
      return 'image/avif';
  }
}

function inferFormatFromMime(
  mimeType: string,
): 'jpeg' | 'png' | 'webp' | 'avif' {
  const m = mimeType.toLowerCase();
  if (m.includes('png')) return 'png';
  if (m.includes('webp')) return 'webp';
  if (m.includes('avif')) return 'avif';
  return 'jpeg';
}

export function outputMimeFromParsedTransform(
  params: ParsedImageTransform,
  sourceMime: string,
): string {
  const f = params.format ?? inferFormatFromMime(sourceMime);
  return mimeForFormat(f);
}

export async function renderImageTransform(
  absoluteInputPath: string,
  sourceMimeType: string,
  params: ParsedImageTransform,
): Promise<{ buffer: Buffer; mimeType: string }> {
  const outFormat = params.format ?? inferFormatFromMime(sourceMimeType);

  let pipeline = sharp(absoluteInputPath, { animated: false }).rotate();

  if (params.width || params.height) {
    pipeline = pipeline.resize(params.width, params.height, {
      fit: params.fit,
      position: 'centre',
    });
  }

  const q = params.quality;

  switch (outFormat) {
    case 'jpeg':
      return {
        buffer: await pipeline.jpeg({ quality: q, mozjpeg: true }).toBuffer(),
        mimeType: mimeForFormat('jpeg'),
      };
    case 'png':
      return {
        buffer: await pipeline.png({ compressionLevel: 9 }).toBuffer(),
        mimeType: mimeForFormat('png'),
      };
    case 'webp':
      return {
        buffer: await pipeline.webp({ quality: q }).toBuffer(),
        mimeType: mimeForFormat('webp'),
      };
    case 'avif':
      return {
        buffer: await pipeline.avif({ quality: q }).toBuffer(),
        mimeType: mimeForFormat('avif'),
      };
  }
}

export function cacheExtensionForTransform(
  params: ParsedImageTransform,
): string {
  const f = params.format ?? 'jpeg';
  if (f === 'jpeg') return '.jpg';
  return `.${f}`;
}

export function transformCacheFileName(
  mediaId: string,
  mtimeMs: number,
  params: ParsedImageTransform,
): string {
  const hash = createHash('sha256')
    .update(JSON.stringify({ mediaId, mtimeMs, params }))
    .digest('hex');
  return `${hash}${cacheExtensionForTransform(params)}`;
}
