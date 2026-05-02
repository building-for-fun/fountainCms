import { resolveExtensionModules } from './extension-catalog';

describe('resolveExtensionModules', () => {
  it('returns no modules for empty input', () => {
    expect(resolveExtensionModules([])).toEqual([]);
  });

  it('resolves known ids', () => {
    const mods = resolveExtensionModules(['example']);
    expect(mods.length).toBe(1);
  });

  it('dedupes and skips unknown ids without throwing', () => {
    const mods = resolveExtensionModules(['example', 'example', 'nonexistent']);
    expect(mods.length).toBe(1);
  });
});
