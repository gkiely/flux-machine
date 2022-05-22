# Fluent machine
Generate xstate machines using JSX or JSON and chainable methods

Example:
```tsx
import createConfig from 'fluent-machine';
import createMachine from '@xstate/fsm';

// State chart using JSX (also supports using Xstate configuration)
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

const config = createConfig(humanStateChart, context);

// Chained syntax
config
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

config
  .when({
    state: "sleeping"
  })
  .assign((context) => ({
    energy: context.energy++,
    speed: 0
  }));

export const machine = createMachine(machineConfig.get());
```
