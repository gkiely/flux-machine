# Flux machine

Spec compliant finite state machines using JSX and chainable methods.

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

| SCXML specification                                   | flux-machine | Supported via     |
| ----------------------------------------------------- | :----------: | ----------------- |
| [scxml](https://www.w3.org/TR/scxml/#scxml)           |      ✅      | `<SCXML>`         |
| [state](https://www.w3.org/TR/scxml/#state)           |      ✅      | `<State>`         |
| [parallel](https://www.w3.org/TR/scxml/#parallel)     |      ❌      |                   |
| [transition](https://www.w3.org/TR/scxml/#transition) |      ✅      | `<Transition>`    |
| [initial](https://www.w3.org/TR/scxml/#initial)       |      ✅      | `<State initial>` |
| [final](https://www.w3.org/TR/scxml/#final)           |      ✅      | `<Final>`         |
| [onentry](https://www.w3.org/TR/scxml/#onentry)       |      ✅      | `.onEntry()`      |
| [onexit](https://www.w3.org/TR/scxml/#onexit)         |      ✅      | `.onExit()`       |
| [history](https://www.w3.org/TR/scxml/#history)       |      ❌      |                   |
| [raise](https://www.w3.org/TR/scxml/#raise)           |      ❌      |                   |
| [if](https://www.w3.org/TR/scxml/#if)                 |      ❌      |                   |
| [elseif](https://www.w3.org/TR/scxml/#elseif)         |      ❌      |                   |
| [else](https://www.w3.org/TR/scxml/#else)             |      ❌      |                   |
| [foreach](https://www.w3.org/TR/scxml/#foreach)       |      ❌      |                   |
| [log](https://www.w3.org/TR/scxml/#log)               |      ❌      |                   |
| [datamodel](https://www.w3.org/TR/scxml/#datamodel)   |      ✅      | `fsm(..., data)`  |
| [data](https://www.w3.org/TR/scxml/#data)             |      ✅      | `fsm(..., data)`  |
| [assign](https://www.w3.org/TR/scxml/#assign)         |      ✅      | `.assign()`       |
| [donedata](https://www.w3.org/TR/scxml/#donedata)     |      ❌      |                   |
| [content](https://www.w3.org/TR/scxml/#content)       |      ❌      |                   |
| [param](https://www.w3.org/TR/scxml/#param)           |      ❌      |                   |
| [script](https://www.w3.org/TR/scxml/#script)         |      ✅      | `.action()`       |
| [send](https://www.w3.org/TR/scxml/#send)             |      ✅      | `.send()`         |
| [cancel](https://www.w3.org/TR/scxml/#cancel)         |      ❌      |                   |
| [invoke](https://www.w3.org/TR/scxml/#invoke)         |      ✅      | `.invoke()`       |
| [finalize](https://www.w3.org/TR/scxml/#finalize)     |      ❌      |                   |

## Additional features

| Feature | flux-machine |
| ------- | :----------: |
| JSX     |      ✅      |
| XML     |      ❌      |
| JSON    |      ❌      |

## Bundle size

[ 3kb minified and gzipped](https://bundlephobia.com/package/flux-machine)

## Credit

This library uses [@xstate/fsm](https://github.com/statelyai/xstate/tree/main/packages/xstate-fsm) for it's finite state machine.

## FAQ

### Can I use this in production?

- I do not recommend it until it reaches V1.0.0

### Why the name flux?

- [(Flu)ent](https://en.wikipedia.org/wiki/Fluent_interface) [(X)ML](https://www.w3.org/XML)

## Additional examples

### Re-use transitions

```tsx
const goToStart = <Transition event="start" target="1" />;
const goToEnd = <Transition event="end" target="3" />;
const sc = (
  <>
    <State initial id="1">
      {goToEnd}
    </State>
    <State id="2">{goToEnd}</State>
    <State id="3">{goToStart}</State>
  </>
);
```

### Listen to transitions from any state

```tsx
machine
  .when({
    event: "end",
  })
  .action(() => {
    console.log("end event"); // Fires any time 'end' event is sent
  });
```
