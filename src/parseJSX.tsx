import { FC, StateProps, TransitionProps } from './types';

export const State: FC<StateProps> = ({ children, id }) => <meta id={id}>{children}</meta>;
export const Transition: FC<TransitionProps> = ({ children, event, target }) => <></>;

// JSX parser
export const parseJSX = (jsx: JSX.Element) => {
  return {};
};
