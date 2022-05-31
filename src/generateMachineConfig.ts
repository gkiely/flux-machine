import { assign } from '@xstate/fsm';
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
    cond?: (data: AnyObj) => boolean;
    action?: (data: AnyObj) => void;
    actions?: Transition['actions'];
  } & Record<string, string | boolean | number>;
};

type ParsedOutput =
  | {
      props: Props;
    }
  | Props;

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

export const parser = (node: JSX.Element | AnyObj): ParsedOutput => {
  return Object.keys(node).reduce((prev, key) => {
    const value = replacer(key, node[key]);
    if (value === undefined) return prev;

    if (Array.isArray(value)) {
      return {
        ...prev,
        [key]: value.map(child => parser(child)),
      };
    } else if (typeof value === 'object') {
      return {
        ...prev,
        [key]: parser(value),
      };
    }
    return {
      ...prev,
      [key]: value,
    };
  }, {} as ParsedOutput);
};

const parseJSX = (jsx: JSX.Element): ParsedOutput => {
  return parser(jsx);
};

const getChildren = (children: Props['children'], nodeType: NodeType | NodeType[]): Props[] =>
  (Array.isArray(children) ? children : [children]).filter(child =>
    Array.isArray(nodeType) ? nodeType.includes(child.type) : child.type === nodeType
  );

// JSX parser
export const generateMachineConfig = <Data extends AnyObj>(
  jsx: JSX.Element,
  data?: Data | null
): Config<Data> => {
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
        const { event, action, actions = [], ...rest } = transition.props;

        if (action) {
          actions.push(action);
        }

        if (rest.assign) {
          // @ts-expect-error
          actions.push(assign(rest.assign));
        }

        acc[event] = {
          ...(actions.length ? { actions } : {}),
          ...rest,
        };
        return acc;
      }, {} as Record<string, Transition>),
    };

    return acc;
  }, {});

  output.initial = states.find(state => state.props.initial)?.props.id ?? states[0]?.props.id;

  return output;
};
