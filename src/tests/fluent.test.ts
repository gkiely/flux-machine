import { assign } from '@xstate/fsm';
import { fluent, handleError } from '../fluent';
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

const emptyConfig = {
  initial: '',
  states: {},
};

describe('handleError', () => {
  it('should throw an error if no event is specified', () => {
    expect(() => handleError(null, 'action')).toThrow('No event specified, required for action');
  });
  it('should throw an error if no event is specified', () => {
    expect(() => handleError('event', 'action')).toThrow(
      'Unexpected error, state and event provided for action'
    );
  });
});

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

  it('should throw an error if no event is provided', () => {
    const fn = jest.fn();
    const config = baseConfig;

    expect(() => {
      fluent(config)
        .when({
          state: 'sleeping',
        })
        .action(fn);
    }).toThrow('No event specified, required for action');
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
  it('should throw an error if no event is provided', () => {
    const fn = jest.fn();
    const config = baseConfig;

    expect(() => {
      fluent(config)
        .when({
          state: 'sleeping',
        })
        .cond(fn);
    }).toThrow('No event specified, required for cond');
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

  it('should throw an error if no event is provided', () => {
    const fn = jest.fn();
    const config = baseConfig;

    expect(() => {
      fluent(config)
        .when({
          state: 'sleeping',
        })
        .assign(fn);
    }).toThrow('No event specified, required for assign');
  });
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

describe('onEntry', () => {
  it('should add an entry handler', () => {
    const fn = jest.fn();
    const config = { ...baseConfig };
    const fsm = fluent(config)
      .when({
        state: 'sleeping',
        event: 'wake',
      })
      .onEntry(fn);

    const result = immer(config, draft => {
      // @ts-expect-error
      draft.states.sleeping.entry = [fn];
    });

    expect(fsm.get()).toEqual(result);
  });
  it('should handle no state entry handler', () => {
    const fn = jest.fn();
    const config = { ...baseConfig };
    const fsm = fluent(config)
      .when({
        event: 'wake',
      })
      .onEntry(fn);

    expect(fsm.get()).toEqual(config);
  });
});

describe('onExit', () => {
  it('should add an exit handler', () => {
    const fn = jest.fn();
    const config = { ...baseConfig };
    const fsm = fluent(config)
      .when({
        state: 'sleeping',
        event: 'wake',
      })
      .onExit(fn);

    const result = immer(config, draft => {
      // @ts-expect-error
      draft.states.sleeping.exit = [fn];
    });

    expect(fsm.get()).toEqual(result);
  });

  it('should handle no state exit handler', () => {
    const fn = jest.fn();
    const config = { ...baseConfig };
    const fsm = fluent(config)
      .when({
        event: 'wake',
      })
      .onExit(fn);

    expect(fsm.get()).toEqual(config);
  });
});
