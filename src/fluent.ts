import { assign, createMachine, interpret } from '@xstate/fsm';
import { Config, WhenArgs } from './types';

const handleError = (state: string | undefined, event: string | null, methodName: string) => {
  const msg = !state ? 'No state specified' : !event ? `No event specified, required for ${methodName}` : '';
  throw new Error(msg);
};

export const fluent = <Data>(machineConfig: Config) => {
  const config = structuredClone(machineConfig);
  let currentState = config.initial;
  let currentEvent: string | null = null;

  return {
    action(fn: (data: Data) => void) {
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
    assign(fn: (data: Data) => Partial<Data>) {
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
    cond(fn: (data: Data) => boolean) {
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
    condition(fn: (data: Data) => boolean) {
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
