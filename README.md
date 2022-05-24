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

const data = {
  energy: 10,
  speed: 0,
};

// Create a machine (also supports SCXML or Xstate JSON)
const humanMachine = fsm(humanStateChart, data);

// Add conditions, assignments or invoke side effects with chained syntax
humanMachine
  .when({
    state: "sleeping",
    event: "walk",
  })
  .assign(() => ({
    speed: 1,
  }));

humanMachine
  .when({
    state: "walking",
    event: "run",
  })
  .cond((data) => {
    return data.energy > 5;
  })
  .assign((context) => ({
    energy: data.energy--,
    speed: 10,
  }));

humanMachine
  .when({
    state: "sleeping",
  })
  .assign((data) => ({
    energy: data.energy++,
    speed: 0,
  }));

// Start machine
export const service = humanMachine.start();

// Interact with machine
service.send("walk");
console.log(service.state.value); // walking
console.log(service.state.context); // { speed: 1 }
```

## Features

[SCXML specification](https://www.w3.org/TR/scxml)

| SCXML specification | flux-machine | Supported via     |
| ------------------- | :----------: | ----------------- |
| scxml               |      ✅      | `<SCXML>`         |
| state               |      ✅      | `<State>`         |
| parallel            |      ❌      |                   |
| transition          |      ✅      | `<Transition>`    |
| initial             |      ✅      | `<State initial>` |
| final               |      ❌      |                   |
| onentry             |      ✅      | `.onEntry()`      |
| onexit              |      ✅      | `.onExit()`       |
| history             |      ❌      |                   |
| raise               |      ❌      |                   |
| if                  |      ❌      |                   |
| elseif              |      ❌      |                   |
| else                |      ❌      |                   |
| foreach             |      ❌      |                   |
| log                 |      ❌      |                   |
| datamodel           |      ✅      | `fsm(..., data)`  |
| data                |      ✅      | `fsm(..., data)`  |
| assign              |      ✅      | `.assign()`       |
| donedata            |      ❌      |                   |
| content             |      ❌      |                   |
| param               |      ❌      |                   |
| script              |      ✅      | `.action()`       |
| send                |      ✅      | `.send()`         |
| cancel              |      ❌      |                   |
| invoke              |      ✅      | `.invoke()`       |
| finalize            |      ❌      |                   |

## Additional features

| Feature | flux-machine |
| ------- | :----------: |
| JSX     |      ✅      |
| XML     |      ❌      |
| JSON    |      ❌      |

## FAQ

### Can I use this in production?

- I do not recommend it until it reaches V1.0.0
