import type { FC as FCR, PropsWithChildren } from 'react';
export type FC<T> = FCR<PropsWithChildren<T>>;

export type AnyObj = Record<string, any>;

export type JSXStateProps = {
  id: string;
  initial?: boolean;
};

export type JSXTransitionProps = {
  event: string;
  target: string;
};

export type WhenArgs = {
  state: string;
  event?: string;
};

// Xstate types
export type Transition = {
  target: string;
  actions?: Function[];
  cond?: Function;
};

export type State = Partial<{
  initial: string;
  entry: Function[];
  exit: Function[];
  always: Function[];
  on: Record<string, Transition>;
  states: Record<string, State>;
}>;

export type Config = {
  initial: string;
  context?: AnyObj;
  states: Record<string, State>;
};

export function assert(value: unknown): asserts value {
  if (value === undefined) {
    throw new Error('value must be defined');
  }
}

export function assertType<T>(value: unknown): asserts value is T {
  if (value === undefined) {
    throw new Error('value must be defined');
  }
}
