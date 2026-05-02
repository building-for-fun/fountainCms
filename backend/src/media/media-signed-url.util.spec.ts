import {
  canonicalTransformQueryForSig,
  signMediaFileRequest,
  verifyMediaFileRequest,
} from './media-signed-url.util';

describe('media-signed-url.util', () => {
  const secret = 'test-secret';

  it('signs and verifies with transform params', () => {
    const id = '550e8400-e29b-41d4-a716-446655440000';
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const query = { w: '100', h: '80', format: 'webp', exp: String(exp) };
    const sig = signMediaFileRequest(id, exp, query, secret);
    expect(verifyMediaFileRequest(id, { ...query, sig }, secret)).toBe(true);
  });

  it('canonical query excludes exp/sig and sorts keys', () => {
    expect(
      canonicalTransformQueryForSig({
        w: '1',
        h: '2',
        format: 'png',
        exp: '999',
        sig: 'abc',
      }),
    ).toBe('format=png&h=2&w=1');
  });

  it('rejects tampered transform params', () => {
    const id = '550e8400-e29b-41d4-a716-446655440000';
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const query = { w: '100', exp: String(exp) };
    const sig = signMediaFileRequest(id, exp, query, secret);
    expect(
      verifyMediaFileRequest(id, { ...query, sig, w: '200' }, secret),
    ).toBe(false);
  });
});
