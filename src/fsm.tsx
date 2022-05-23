import { generateMachineConfig } from './generateMachineConfig';
import { fluent } from './fluent';
import { AnyObj } from './types';

/// TODO: SCXML parser
// export const parseSCXML = (xml: string) => {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(xml, 'text/html');
//   console.log(doc);
// }

// convert JSX, SCXML JSON to xstate/fsm
// return fluent api
export default (stateChart: JSX.Element, data: AnyObj) => {
  const machineConfig = generateMachineConfig(stateChart, data);
  return fluent(machineConfig);
};
