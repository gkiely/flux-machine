import { FC, StateProps, TransitionProps } from './types';

export const State: FC<StateProps> = ({ children, id }) => <meta id={id}>{children}</meta>;
export const Transition: FC<TransitionProps> = ({ children, event, target }) => <></>;

type Props = {
  type: string;
  children: Props | Props[];
  props: Props & {
    id: string;
    event: string;
    target: string;
  } & Record<string, string | boolean | number>;
};

type ParsedOutput = {
  props: Props;
};

const parseJSX = (jsx: JSX.Element): ParsedOutput => {
  const replacer = (key: string, value: Record<string, any>) => {
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

// JSX parser
export const generateMachineConfig = <C extends object>(jsx: JSX.Element, data?: C) => {
  const baseConfig = {
    ...(data && { context: data }),
    states: {},
  };
  const config = parseJSX(jsx);
  if (!config.props.children) return baseConfig;

  return config;
};
