import { assign, createMachine, interpret } from '@xstate/fsm';
import { AnyObj, Config, WhenArgs } from './types';
import { omit } from './utils';

export const handleError = (event: string | null, methodName: string) => {
  if (!event) {
    throw new Error(`No event specified, required for ${methodName}`);
  }
  throw new Error(`Unexpected error, state and event provided for ${methodName}`);
};

type InvokeKey = 'onError' | 'onDone';

export const fluent = <Data>(machineConfig: Config<Data>) => {
  const config = structuredClone(machineConfig);
  let currentState = config.initial;
  let currentEvent: string | null = null;

  // --- Invoke ---
  const catchThenableMethods = {
    assign(fn: (data: Data) => Partial<Data>, key: InvokeKey) {
      const transition = config.states?.[currentState]?.invoke?.[key];

      if (transition) {
        transition.actions ??= [];
        transition.actions.push(assign(fn));
      }
      return {
        ...fluentMethods,
      };
    },
    target(state: string, key: InvokeKey): void {
      const transition = config.states?.[currentState]?.invoke;
      if (transition) {
        transition[key] = {
          target: state,
        };
      }
    },
  };

  const catchableMethods = {
    assign(fn: (data: Data) => Partial<Data>) {
      catchThenableMethods.assign(fn, 'onError');
      return {
        ...fluentMethods,
      };
    },
    target(state: string) {
      catchThenableMethods.target(state, 'onError');
      return {
        ...fluentMethods,
        ...omit(catchableMethods, 'target'),
      };
    },
  };

  const thenableMethods = {
    assign(fn: (data: Data) => Partial<Data>) {
      catchThenableMethods.assign(fn, 'onDone');
      return {
        ...fluentMethods,
        catch: catchableMethods,
      };
    },
    target(state: string) {
      catchThenableMethods.target(state, 'onDone');
      return {
        ...fluentMethods,
        catch: catchableMethods,
        ...omit(thenableMethods, 'target'),
      };
    },
  };
  // --- /Invoke ---

  const fluentMethods = {
    action(fn: (data: Data) => void) {
      if (!currentEvent) {
        return handleError(currentEvent, 'action');
      }

      const transition = config.states?.[currentState]?.on?.[currentEvent];

      if (transition) {
        transition.actions ??= [];
        transition.actions.push(fn);
      }
      return this;
    },
    assign(fn: (data: Data) => Partial<Data>) {
      if (!currentEvent) {
        return handleError(currentEvent, 'assign');
      }
      const transition = config.states?.[currentState]?.on?.[currentEvent];

      if (transition) {
        transition.actions ??= [];
        transition.actions.push(assign(fn));
      }
      return this;
    },

    cond(fn: (data: Data) => boolean) {
      if (!currentEvent) {
        return handleError(currentEvent, 'cond');
      }

      const transition = config.states?.[currentState]?.on?.[currentEvent];
      if (transition) {
        transition.cond = fn;
      }

      return this;
    },
    // Alias for cond
    condition(fn: (data: Data) => boolean) {
      this.cond(fn);
      return this;
    },
    // delay() {
    //   return this;
    // },
    onEntry(fn: (data: Data) => void) {
      const state = config.states?.[currentState];
      if (!state) return this;

      state.entry ??= [];
      state.entry.push(fn);

      return this;
    },
    onExit(fn: (data: Data) => void) {
      const state = config.states?.[currentState];
      if (!state) return this;

      state.exit ??= [];
      state.exit.push(fn);

      return this;
    },
    get: () => config,
    invoke(fn: (data: Data) => Promise<AnyObj | void>) {
      const state = config.states?.[currentState];

      if (state) {
        state.invoke = {
          src: fn,
        };
      }
      return {
        ...this,
        catch: catchableMethods,
        then: thenableMethods,
      };
    },
    start() {
      // @ts-expect-error
      return interpret<Data>(createMachine(config)).start();
    },
  };

  return {
    get: () => config,
    when(args: WhenArgs) {
      if ('state' in args) {
        currentState = args.state;
      }
      if ('event' in args) {
        currentEvent = args.event;
      }
      return fluentMethods;
    },
    start: fluentMethods.start,
  };
};
