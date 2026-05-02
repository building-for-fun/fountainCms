import {
  hasContentPermission,
  type ContentOperation,
} from './content-permissions';

describe('hasContentPermission', () => {
  it('matches explicit publish permission', () => {
    expect(hasContentPermission(['posts:publish'], 'posts', 'publish')).toBe(
      true,
    );
  });

  it('matches collection wildcard including publish', () => {
    expect(hasContentPermission(['posts:*'], 'posts', 'publish')).toBe(true);
  });

  it('matches global wildcard', () => {
    expect(hasContentPermission(['*:*'], 'posts', 'publish')).toBe(true);
  });

  it('does not grant publish from update alone', () => {
    expect(hasContentPermission(['posts:update'], 'posts', 'publish')).toBe(
      false,
    );
  });

  it('still matches core operations', () => {
    const ops: ContentOperation[] = [
      'create',
      'read',
      'update',
      'publish',
      'delete',
    ];
    for (const op of ops) {
      expect(hasContentPermission([`articles:${op}`], 'articles', op)).toBe(
        true,
      );
    }
  });
});
