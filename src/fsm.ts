// JSX parser
export const parseJSX = () => {
}

// SCXML parser (todo)
export const parseSCXML = (xml: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/html');
  console.log(doc);
}

export const fluent = (config: any) => ({
  action: () => {},
  assign: () => {},
  catch: () => {},
  cond: () => {},
  // Alias for cond
  condition(...args: any) {
    this.condition(...args);
  },
  delay: () => {},
  entry: () => {},
  exit: () => {},
  invoke: () => {},
  then: () => {},
  when: () => {},
})


// convert JSX, SCXML JSON to xstate/fsm
// return fluent api
export default (stateChart: any, data: any) => {

}
