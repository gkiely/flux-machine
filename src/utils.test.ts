import { omit } from './utils';

describe('utils', () => {
  describe('omit', () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
    };
    it('should omit keys', () => {
      const result = omit(obj, 'a', 'c');
      expect(result).toEqual({
        b: 2,
      });
    });

    it('should omit a single key', () => {
      const result = omit(obj, 'a');
      expect(result).toEqual({
        b: 2,
        c: 3,
      });
    });
  });
});
