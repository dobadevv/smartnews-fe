import { describe, expect, it } from 'vitest';
import { joinClassNames } from '@/lib/classNames';

describe('joinClassNames', () => {
  it('joins truthy class names with single spaces', () => {
    expect(joinClassNames('a', false, 'b', null, undefined, '', 'c')).toBe('a b c');
  });
});
