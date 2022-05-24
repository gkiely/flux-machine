# Flux machine

Spec compliant state machines using JSX, SCXML or JSON and chainable methods.

Installation:

```sh
npm install flux-machine
```

Example:

```tsx
import fsm, { State, Transition } from "flux-machine";

// Define state chart using JSX
const humanStateChart = (
  <>
    <State initial id="sleeping">
      <Transition event="walk" target="walking" />
    </State>
    <State id="walking">
      <Transition event="sleep" target="sleeping" />
      <Transition event="run" target="running" />
    </State>
    <State initial id="running">
      <Transition event="walk" target="walking" />
    </State>
  </>
);

const context = {
  energy: 10,
  speed: 0,
};

// Create a machine (also supports SCXML or Xstate JSON)
const humanMachine = fsm(humanStateChart, context);

// Add conditions, assignments or invoke side effects with chained syntax
humanMachine
  .when({
    state: "walking",
    event: "run",
  })
  .cond((context) => {
    return context.energy > 5;
  })
  .assign((context) => ({
    energy: context.energy--,
    speed: 10,
  }));

humanMachine
  .when({
    state: "sleeping",
  })
  .assign((context) => ({
    energy: context.energy++,
    speed: 0,
  }));

// Start machine
export const service = humanMachine.start();
```

## Features

[SCXML specification](https://www.w3.org/TR/scxml)

| SCXML specification | **flux-machine** | Supported via     |
| ------------------- | :--------------: | ----------------- |
| scxml               |        ✅        | `<SCXML>`         |
| state               |        ✅        | `<State>`         |
| parallel            |        ❌        |                   |
| transition          |        ✅        | `<Transition>`    |
| initial             |        ✅        | `<State initial>` |
| final               |        ❌        |                   |
| onentry             |        ❌        |                   |
| onexit              |        ❌        |                   |
| history             |        ❌        |                   |
| raise               |        ❌        |                   |
| if                  |        ❌        |                   |
| elseif              |        ❌        |                   |
| else                |        ❌        |                   |
| foreach             |        ❌        |                   |
| log                 |        ❌        |                   |
| datamodel           |        ✅        |                   |
| data                |        ✅        |                   |
| assign              |        ✅        |                   |
| donedata            |        ❌        |                   |
| content             |        ❌        |                   |
| param               |        ❌        |                   |
| script              |        ❌        |                   |
| send                |        ✅        | `.invoke()`       |
| cancel              |        ❌        |                   |
| invoke              |        ✅        | `.invoke()`       |
| finalize            |        ❌        |                   |

## FAQ

### Can I use this in production?

- I do not recommend it until it reaches V1.0.0
- It's an experiment that I coded in a weekend it and only supports the test cases in `src/tests/fsm.test.tsx`
