import { generateMachineConfig } from './generateMachineConfig';
import { fluent } from './fluent';
import { AnyObj, FC, JSXFinalProps, JSXSCXMLProps, JSXStateProps, JSXTransitionProps } from './types';

export const SCXML: FC<JSXSCXMLProps> = () => null;
export const State: FC<JSXStateProps> = () => null;
export const Transition: FC<JSXTransitionProps> = () => null;
export const Final: FC<JSXFinalProps> = () => null;

// converts JSX, SCXML JSON to json and returns fluent api
export default <Data extends AnyObj>(stateChart: JSX.Element, data?: Data) => {
  const machineConfig = generateMachineConfig(stateChart, data);
  return fluent<Data>(machineConfig);
};
