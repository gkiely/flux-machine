/// TODO:
// This looks a lot like parser, see if you can use that instead
// Alternatively, reduce the file size by running a structured clone
// And then just search for functions and add them into the new cloned object

// Reference
// https://javascript.plainenglish.io/write-a-better-deep-clone-function-in-javascript-d0e798e5f550#0bd8

import { AnyObj, assert } from './types';

// core function
const clone = <Obj extends AnyObj>(target: Obj, map = new WeakMap()): Obj => {
  // clone primitive types
  if (typeof target != 'object' || target == null) {
    return target;
  }

  let cloneTarget: Obj | null = null;

  map.set(target, cloneTarget);

  if (Array.isArray(target)) {
    // @ts-expect-error
    cloneTarget = target.map((item: AnyObj) => clone(item, map));
  } else if (typeof target == 'object') {
    cloneTarget = Object.keys(target).reduce((acc, key) => {
      return {
        ...acc,
        [key]: clone(target[key], map),
      };
    }, {} as Obj);
  }

  assert(cloneTarget);

  return cloneTarget;
};

export default clone;
