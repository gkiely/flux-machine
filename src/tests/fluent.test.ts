import { assign } from '@xstate/fsm';
import { fluent } from '../fluent';
import immer from 'immer';

const baseConfig = {
  initial: '',
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
    const config = baseConfig;

    const fsm = fluent(config)
      .when({
        state: 'sleeping',
        event: 'wake',
      })
      .action(fn)
      .get();

    const result = immer(config, draft => {
      // @ts-expect-error
      draft.states.sleeping.on.wake.actions = [fn];
    });

    expect(fsm).toEqual(result);
  });

  it('should add multiple actions', () => {
    const fn = jest.fn();
    const config = { ...baseConfig };

    const fsm = fluent(config)
      .when({
        state: 'sleeping',
        event: 'wake',
      })
      .action(fn)
      .action(fn)
      .get();

    const result = immer(config, draft => {
      // @ts-expect-error
      draft.states.sleeping.on.wake.actions = [fn, fn];
    });

    expect(fsm).toEqual(result);
  });
});

describe('cond', () => {
  it('should add a condition', () => {
    const fn = jest.fn();
    const config = { ...baseConfig };

    const fsm = fluent(config)
      .when({
        state: 'sleeping',
        event: 'wake',
      })
      .condition(fn)
      .get();

    const result = immer(config, draft => {
      // @ts-expect-error
      draft.states.sleeping.on.wake.cond = fn;
    });

    expect(fsm).toEqual(result);
  });
});

describe('assign', () => {
  it('should add an assign', () => {
    const fn = jest.fn(data => ({
      speed: data?.speed + 1,
    }));
    const config = {
      context: {
        speed: 0,
      },
      ...baseConfig,
    };

    const fsm = fluent(config)
      .when({
        state: 'sleeping',
        event: 'wake',
      })
      .assign(fn)
      .get();

    const result = immer(config, draft => {
      // @ts-expect-error
      draft.states.sleeping.on.wake.actions = [assign(fn)];
    });

    expect(fsm).toEqual(result);
  });

  describe('invoke', () => {
    it('should add an invoke', () => {
      const fetchMock = jest.fn((url: string) => Promise.resolve({ data: 1 }));
      const invoke = jest.fn(() => fetchMock('./data.json'));
      const config = {
        ...baseConfig,
      };
      const fsm = fluent(config)
        .when({
          state: 'sleeping',
        })
        .invoke(invoke)
        .get();

      const result = immer(config, draft => {
        // @ts-expect-error
        draft.states.sleeping.invoke = {
          src: invoke,
        };
      });

      expect(fsm).toEqual(result);
    });

    it('should add an onDone and onError to invoke', () => {
      const fetchMock = jest.fn((url: string) => Promise.resolve({ data: 1 }));
      const invoke = jest.fn(() => fetchMock('./data.json'));
      const fn = jest.fn(data => ({ speed: data?.speed + 1 }));
      const config = {
        ...baseConfig,
      };
      const fsm = fluent(config)
        .when({
          state: 'sleeping',
        })
        .invoke(invoke)
        .then.target('awake')
        .assign(fn)
        .catch.target('awake')
        .assign(fn);

      const result = immer(config, draft => {
        // @ts-expect-error
        draft.states.sleeping.invoke = {
          src: invoke,
          onDone: {
            target: 'awake',
            actions: [assign(fn)],
          },
          onError: {
            target: 'awake',
            actions: [assign(fn)],
          },
        };
      });

      expect(fsm.get()).toEqual(result);
    });
  });
});
