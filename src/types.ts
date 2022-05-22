import { FC as FCR, PropsWithChildren } from 'react';
export type FC<T> = FCR<PropsWithChildren<T>>;

export type StateProps = {
  id: string;
  initial?: boolean;
};

export type TransitionProps = {
  event: string;
  target: string;
};

export type WhenArgs = {
  state: string;
  event?: string;
};
