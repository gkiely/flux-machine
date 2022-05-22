import { FC, StateProps, TransitionProps, WhenArgs } from './types';

export const State: FC<StateProps> = ({ children, id }) => <meta id={id}>{children}</meta>;
export const Transition: FC<TransitionProps> = ({ children, event, target }) => <></>;

// JSX parser
export const parseJSX = (jsx: JSX.Element) => {
  return {};
};

/// TODO: SCXML parser
// export const parseSCXML = (xml: string) => {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(xml, 'text/html');
//   console.log(doc);
// }

export const fluent = (machineConfig: any) => {
  const config = { ...machineConfig };
  return {
    action(fn: () => any) {
      return this;
    },
    assign(fn: () => any) {
      return this;
    },
    catch() {
      return this;
    },
    cond() {
      return this;
    },
    // Alias for cond
    condition(...args: any) {
      this.condition(...args);
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
      return this;
    },
  };
};

// convert JSX, SCXML JSON to xstate/fsm
// return fluent api
export default (stateChart: any, data: any) => {};
