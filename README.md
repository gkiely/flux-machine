# Fluent machine

Spec compliant state machines using JSX, SCXML or JSON and chainable methods.

Example:

```tsx
import fsm from "fluent-machine";

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

| SCXML specification | **flux-machine** |
| ------------------- | :--------------: |
| scxml               |        ❌        |
| state               |        ✅        |
| parallel            |        ❌        |
| transition          |        ✅        |
| initial             |        ✅        |
| final               |        ❌        |
| onentry             |        ❌        |
| onexit              |        ❌        |
| history             |        ❌        |
| raise               |        ❌        |
| if                  |        ❌        |
| elseif              |        ❌        |
| else                |        ❌        |
| foreach             |        ❌        |
| log                 |        ❌        |
| datamodel           |        ✅        |
| data                |        ✅        |
| assign              |        ✅        |
| donedata            |        ❌        |
| content             |        ❌        |
| param               |        ❌        |
| script              |        ❌        |
| send                |        ✅        |
| cancel              |        ❌        |
| invoke              |        ✅        |
| finalize            |        ❌        |

## FAQ

### Should I use this in production?

- No, not until it reaches V1.0.0
- It's an experiment that I coded in a weekend it and only supports the conditions in `src/tests/fsm.test.tsx`
