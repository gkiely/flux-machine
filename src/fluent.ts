import { assign } from '@xstate/fsm';
import { AnyObj, Config, WhenArgs } from './types';

export const fluent = (machineConfig: Config) => {
  const config = structuredClone(machineConfig);
  let currentState = config.initial;
  let currentEvent: string | null = null;

  return {
    action(fn: () => any) {
      if (!currentState) {
        throw new Error('No state specified');
      }
      if (!currentEvent) {
        throw new Error('No event specified, required for action');
      }

      const transition = config.states?.[currentState]?.on?.[currentEvent];

      if (transition) {
        transition.actions ??= [];
        transition.actions.push(fn);
      }
      return this;
    },
    assign(fn: (data: Config['context']) => any) {
      if (!currentState) {
        throw new Error('No state specified');
      }
      if (!currentEvent) {
        throw new Error('No event specified, required for assign');
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
      if (!currentState) {
        throw new Error('No state specified');
      }
      if (!currentEvent) {
        throw new Error('No event specified, required for condition');
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
      // return interpreted machine with @xstate/fsm
      // return interpret(createMachine(config)).start();
    },
  };
};
