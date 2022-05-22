import { fluent } from '../fsm';
import immer from 'immer';

const baseConfig = {
  states: {
    sleeping: {
      on: {
        wake: {
          target: 'awake',
        },
      },
    },
  },
};

describe('action', () => {
  it('should add an action', () => {
    const fn = jest.fn();
    const config = { ...baseConfig };

    const fsm = fluent(config)
      .when({
        state: 'sleeping',
      })
      .action(fn)
      .get();

    const result = immer(config, draft => {
      // @ts-expect-error
      draft.states.sleeping.on.wake.actions = [fn];
    });

    expect(fsm).toBe(result);
  });
});

describe('cond', () => {
  it('should add a condition', () => {
    const fn = jest.fn();
    const config = { ...baseConfig };

    const fsm = fluent(config)
      .when({
        state: 'sleeping',
      })
      .condition(fn)
      .get();

    const result = immer(config, draft => {
      // @ts-expect-error
      draft.states.sleeping.on.wake.cond = fn;
    });

    expect(fsm).toBe(result);
  });
});

describe('assign', () => {
  it('should add an assign', () => {
    const fn = jest.fn();
    const config = { ...baseConfig };

    const fsm = fluent(config)
      .when({
        state: 'sleeping',
      })
      .assign(fn)
      .get();

    const result = immer(config, draft => {
      // @ts-expect-error
      draft.states.sleeping.on.wake.actions = [fn];
    });

    expect(fsm).toBe(result);
  });
});
