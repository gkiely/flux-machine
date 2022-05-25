import { generateMachineConfig } from './generateMachineConfig';
import { fluent } from './fluent';
import { AnyObj, FC, JSXFinalProps, JSXSCXMLProps, JSXStateProps, JSXTransitionProps } from './types';

export const SCXML: FC<JSXSCXMLProps> = () => null;
export const State: FC<JSXStateProps> = () => null;
export const Transition: FC<JSXTransitionProps> = () => null;
export const Final: FC<JSXFinalProps> = () => null;

/// TODO: SCXML parser
// export const parseSCXML = (xml: string) => {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(xml, 'text/html');
//   console.log(doc);
// }

// convert JSX, SCXML JSON to xstate/fsm
// return fluent api
export default <Data extends AnyObj>(stateChart: JSX.Element, data?: Data) => {
  const machineConfig = generateMachineConfig(stateChart, data);
  return fluent<Data>(machineConfig);
};
