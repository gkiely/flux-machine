import { assign, createMachine, interpret } from '@xstate/fsm';
import { AnyObj, Config, WhenArgs } from './types';

const handleError = (state: string | undefined, event: string | null, methodName: string) => {
  const msg = !state ? 'No state specified' : !event ? `No event specified, required for ${methodName}` : '';
  throw new Error(msg);
};

export const fluent = (machineConfig: Config) => {
  const config = structuredClone(machineConfig);
  let currentState = config.initial;
  let currentEvent: string | null = null;

  return {
    action(fn: () => any) {
      if (!currentState || !currentEvent) {
        return handleError(currentState, currentEvent, 'action');
      }

      const transition = config.states?.[currentState]?.on?.[currentEvent];

      if (transition) {
        transition.actions ??= [];
        transition.actions.push(fn);
      }
      return this;
    },
    assign(fn: (data: Config['context']) => any) {
      if (!currentState || !currentEvent) {
        return handleError(currentState, currentEvent, 'assign');
      }
      const transition = config.states?.[currentState]?.on?.[currentEvent];

      if (transition) {
        transition.actions ??= [];
        // @ts-expect-error
        transition.actions.push(assign(fn));
      }
      return this;
    },
    catch() {
      return this;
    },
    cond(fn: () => any) {
      if (!currentState || !currentEvent) {
        return handleError(currentState, currentEvent, 'action');
      }

      const transition = config.states?.[currentState]?.on?.[currentEvent];
      if (transition) {
        transition.cond = fn;
      }

      return this;
    },
    // Alias for cond
    condition(fn: () => any) {
      this.cond(fn);
      return this;
    },
    delay() {
      return this;
    },
    get: () => config,
    entry() {
      return this;
    },
    exit() {
      return this;
    },
    invoke() {
      return this;
    },
    then() {
      return this;
    },
    when({ state, event }: WhenArgs) {
      currentState = state;
      currentEvent = event ?? null;
      return this;
    },
    start() {
      // @ts-expect-error
      return interpret(createMachine(config)).start();
    },
  };
};
