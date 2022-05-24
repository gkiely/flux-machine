import { AnyObj } from './types';

export const omit = <O extends AnyObj>(obj: O, ...keys: (keyof O)[]) => {
  return Object.keys(obj).reduce((acc, k) => {
    if (!keys.includes(k)) {
      acc[k] = obj[k];
    }
    return acc;
  }, {} as O);
};
