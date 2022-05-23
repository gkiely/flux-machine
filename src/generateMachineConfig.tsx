import { AnyObj, Config, FC, JSXStateProps, JSXTransitionProps } from './types';

export const State: FC<JSXStateProps> = ({ children, id }) => <meta id={id}>{children}</meta>;
export const Transition: FC<JSXTransitionProps> = ({ children, event, target }) => <></>;

type Props = {
  type: string;
  children: Props | Props[];
  props: Props & {
    id: string;
    event: string;
    target: string;
    initial?: string;
  } & Record<string, string | boolean | number>;
};

type ParsedOutput = {
  props: Props;
};

const parseJSX = (jsx: JSX.Element): ParsedOutput => {
  const replacer = (key: string, value: AnyObj) => {
    switch (key) {
      case '_owner':
      case '_store':
      case 'ref':
      case 'key':
        return;
      case 'type':
        return value?.name;
      default:
        return value;
    }
  };
  const str = JSON.stringify(jsx, replacer);
  return JSON.parse(str);
};

const enum nodeTypes {
  State = 'State',
  Transition = 'Transition',
}

// JSX parser
export const generateMachineConfig = <Data extends AnyObj>(jsx: JSX.Element, data?: Data): Config => {
  const output = {
    initial: '',
    ...(data && { context: data }),
    states: {},
  };
  const config = parseJSX(jsx);
  if (!config.props.children) return output;

  const { props, children } = config.props;

  const states = (Array.isArray(children) ? children : [children]).filter(
    child => child.type === nodeTypes.State
  );

  if (!states) return output;

  output.states = states.reduce((acc: { [k: string]: {} }, state) => {
    const { children, id } = state.props;
    acc[id] = {};
    if (!children) return acc;

    const transitions = (Array.isArray(children) ? children : [children]).filter(
      child => child.type === nodeTypes.Transition
    );

    acc[id] = {
      on: transitions.reduce((acc: { [k: string]: {} }, transition) => {
        const { event, target } = transition.props;
        acc[event] = {
          target,
        };
        return acc;
      }, {}),
    };

    return acc;
  }, {});

  output.initial = states.find(state => state.props.initial)?.props.id ?? states[0]?.props.id ?? '';

  return output;
};
