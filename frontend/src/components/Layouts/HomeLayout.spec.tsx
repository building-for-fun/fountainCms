import { describe, it, expect } from 'vitest';
import HomeLayout from './HomeLayout';

describe('HomeLayout', () => {
  it('should be defined', () => {
    expect(<HomeLayout children={undefined} />).toBeDefined();
  });
});
