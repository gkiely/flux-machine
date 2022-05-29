import { AnyObj, assert, Config, State, Transition } from './types';

const nodeTypes = {
  Final: 'Final',
  SCXML: 'SCXML',
  State: 'State',
  Transition: 'Transition',
} as const;

type NodeType = typeof nodeTypes[keyof typeof nodeTypes];

type Props = {
  type: NodeType;
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

const replacer = (key: string, value: { name: string } & AnyObj) => {
  switch (key) {
    case '_owner':
    case '_store':
    case 'ref':
    case 'key':
    case '$$typeof':
      return;
    case 'type':
      return value?.name;
    default:
      return value;
  }
};

const parseJSX = (jsx: JSX.Element): ParsedOutput => {
  const str = JSON.stringify(jsx, replacer);
  return JSON.parse(str);
};

const getChildren = (children: Props['children'], nodeType: NodeType | NodeType[]): Props[] =>
  (Array.isArray(children) ? children : [children]).filter(child =>
    Array.isArray(nodeType) ? nodeType.includes(child.type) : child.type === nodeType
  );

// JSX parser
export const generateMachineConfig = <Data extends AnyObj>(jsx: JSX.Element, data?: Data): Config<Data> => {
  const output = {
    initial: '',
    ...(data && { context: data }),
    states: {},
  };
  const config = parseJSX(jsx);
  if (!config.props.children) return output;

  const { children } = config.props;

  const states = getChildren(children, [nodeTypes.State, nodeTypes.Final]);

  if (!states.length) return output;
  assert(states[0]);

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

  output.initial = states.find(state => state.props.initial)?.props.id ?? states[0]?.props.id;

  return output;
};
