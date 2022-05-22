# Fluent machine
Spec compliant state machines using JSX, SCXML or JSON and chainable methods.

SCXML specification: https://www.w3.org/TR/scxml/

Example:
```tsx
import fsm from 'fluent-machine';

// State chart using JSX
const humanStateChart = (
  <>
    <State initial id="sleeping">
      <Transition event="walk" target="walking" />
    </State>
    <State initial id="walking">
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
  speed: 0
};

// Create config with JSX (or Xstate JSON)
const humanMachine = fsm(humanStateChart, context);

// Chained syntax
humanMachine
  .when({
    state: "walking",
    event: "run"
  })
  .cond((context) => {
    return context.energy > 5;
  })
  .assign((context) => ({
    energy: context.energy--,
    speed: 10
  }));

humanMachine
  .when({
    state: "sleeping"
  })
  .assign((context) => ({
    energy: context.energy++,
    speed: 0
  }));

export const machine = humanMachine.start();
```
