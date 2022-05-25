import type { FC as FCR, PropsWithChildren } from 'react';
import type { assign } from '@xstate/fsm';
export type FC<T> = FCR<PropsWithChildren<T>>;

// Fixes Object.keys
// https://stackoverflow.com/questions/52856496/typescript-object-keys-return-string
declare global {
  interface ObjectConstructor {
    keys<T>(obj: T): Array<keyof T>;
  }
}

export type AnyObj = Record<string, any>;

export type JSXSCXMLProps = {
  initial?: string;
};

export type JSXFinalProps = {
  id: string;
};

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
  actions?: (ReturnType<typeof assign> | Function)[];
  cond?: Function;
};

export type State<Data> = Partial<{
  initial: string;
  entry: Function[];
  exit: Function[];
  always: Function[];
  on: Record<string, Transition>;
  states: Record<string, State<Data>>;
  type?: 'final';
  invoke: {
    src: (data: Data) => Promise<AnyObj | void>;
    onDone?: Transition;
    onError?: Transition;
  };
}>;

export type Config<Data> = {
  initial: string;
  context?: Data;
  states: Record<string, State<Data>>;
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
