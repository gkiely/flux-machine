import { generateMachineConfig } from './generateMachineConfig';
import { fluent } from './fluent';
import { AnyObj, FC, JSXFinalProps, JSXSCXMLProps, JSXStateProps, JSXTransitionProps } from './types';

/* c8 ignore start */
export const SCXML: FC<JSXSCXMLProps> = () => null;
export const State: FC<JSXStateProps> = () => null;
export const Transition: FC<JSXTransitionProps> = () => null;
export const Final: FC<JSXFinalProps> = () => null;
/* c8 ignore stop */

// converts JSX, SCXML JSON to json and returns fluent api
export default <Data extends AnyObj, A extends AnyObj>(
  stateChart: JSX.Element | ((...args: any[]) => JSX.Element),
  data?: Data | null,
  actions?: A
) => {
  const sc = typeof stateChart === 'function' ? stateChart(actions) : stateChart;
  const machineConfig = generateMachineConfig(sc, data);
  return fluent<Data>(machineConfig);
};
