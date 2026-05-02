import { BadRequestException } from '@nestjs/common';
import { parseMediaTransformQuery } from './media-transform.util';

describe('media-transform.util', () => {
  it('returns null when no transform requested', () => {
    expect(parseMediaTransformQuery({}, 2048)).toBeNull();
    expect(parseMediaTransformQuery({ q: '90' }, 2048)).toBeNull();
  });

  it('parses dimensions and format', () => {
    const p = parseMediaTransformQuery(
      { w: '640', h: '480', format: 'webp', fit: 'contain', q: '85' },
      2048,
    );
    expect(p).toEqual({
      width: 640,
      height: 480,
      fit: 'contain',
      format: 'webp',
      quality: 85,
    });
  });

  it('rejects oversized dimensions', () => {
    expect(() => parseMediaTransformQuery({ w: '99999' }, 2048)).toThrow(
      BadRequestException,
    );
  });
});
