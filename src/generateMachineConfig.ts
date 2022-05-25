import { AnyObj, Config, State, Transition } from './types';

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

const nodeTypes = {
  Final: 'Final',
  SCXML: 'SCXML',
  State: 'State',
  Transition: 'Transition',
} as const;

const getChildren = (
  children: Props['children'],
  nodeType: typeof nodeTypes[keyof typeof nodeTypes]
): Props[] => (Array.isArray(children) ? children : [children]).filter(child => nodeType);

// JSX parser
export const generateMachineConfig = <Data extends AnyObj>(jsx: JSX.Element, data?: Data): Config<Data> => {
  const output = {
    initial: '',
    ...(data && { context: data }),
    states: {},
  };
  const config = parseJSX(jsx);
  if (!config.props.children) return output;

  const { props, children } = config.props;

  const states = getChildren(children, nodeTypes.State);

  if (!states) return output;

  output.states = states.reduce((acc: Record<string, State<Data>>, state) => {
    const { children, id } = state.props;
    acc[id] = {};

    if (state.type === nodeTypes.Final) {
      acc[id] = {
        type: 'final',
      };
    }

    if (!children) return acc;

    const transitions = getChildren(children, nodeTypes.Transition);

    acc[id] = {
      on: transitions.reduce((acc: Record<string, Transition>, transition) => {
        const { event, target } = transition.props;
        acc[event] = {
          target,
        };
        return acc;
      }, {} as Record<string, Transition>),
    };

    return acc;
  }, {});

  output.initial = states.find(state => state.props.initial)?.props.id ?? states[0]?.props.id ?? '';

  return output;
};
