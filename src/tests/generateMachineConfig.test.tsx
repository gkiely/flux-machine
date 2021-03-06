import { generateMachineConfig } from '../generateMachineConfig';
import { Final, State, Transition } from '../fsm';

const sc = (
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

describe('generateMachineConfig', () => {
  it('should parse empty JSX', () => {
    expect(generateMachineConfig(<></>)).toEqual({
      initial: '',
      states: {},
    });
  });

  it('should parse a single state node', () => {
    expect(
      generateMachineConfig(
        <>
          <State id="sleeping"></State>
        </>
      )
    ).toEqual({
      initial: 'sleeping',
      states: {
        sleeping: {},
      },
    });
  });

  it('should parse a single state node with transition', () => {
    expect(
      generateMachineConfig(
        <>
          <State id="sleeping">
            <Transition event="walk" target="walking" />
          </State>
        </>
      )
    ).toEqual({
      initial: 'sleeping',
      states: {
        sleeping: {
          on: {
            walk: {
              target: 'walking',
            },
          },
        },
      },
    });
  });

  it('should set the initial state', () => {
    expect(
      generateMachineConfig(
        <>
          <State id="sleeping">
            <Transition event="walk" target="walking" />
          </State>
          <State id="walking" initial>
            <Transition event="sleep" target="sleeping" />
          </State>
        </>
      )
    ).toEqual(
      expect.objectContaining({
        initial: 'walking',
      })
    );
  });

  it('should parse multiple states and transitions', () => {
    expect(
      generateMachineConfig(
        <>
          <State id="sleeping">
            <Transition event="walk" target="walking" />
          </State>
          <State id="walking" initial>
            <Transition event="sleep" target="sleeping" />
          </State>
        </>
      )
    ).toEqual({
      initial: 'walking',
      states: {
        sleeping: {
          on: {
            walk: {
              target: 'walking',
            },
          },
        },
        walking: {
          on: {
            sleep: {
              target: 'sleeping',
            },
          },
        },
      },
    });
  });

  it('should parse multiple transitions', () => {
    expect(
      generateMachineConfig(
        <>
          <State id="sleeping">
            <Transition event="walk" target="walking" />
            <Transition event="run" target="running" />
          </State>
          <State id="walking" initial>
            <Transition event="sleep" target="sleeping" />
          </State>
        </>
      )
    ).toEqual({
      initial: 'walking',
      states: {
        sleeping: {
          on: {
            walk: {
              target: 'walking',
            },
            run: {
              target: 'running',
            },
          },
        },
        walking: {
          on: {
            sleep: {
              target: 'sleeping',
            },
          },
        },
      },
    });
  });

  it('should return default output if no states are defined', () => {
    expect(
      generateMachineConfig(
        <>
          <Transition event="walk" target="walking" />
        </>
      )
    ).toEqual({
      initial: '',
      states: {},
    });
  });
});

it('should return an empty string for initial if no initial is provided', () => {
  expect(
    generateMachineConfig(
      <>
        <Transition event="walk" target="walking" />
      </>
    )
  ).toEqual({
    initial: '',
    states: {},
  });
});

describe('final', () => {
  it('parse a final node', () => {
    expect(
      generateMachineConfig(
        <>
          <State id="awake"></State>
          <Final id="sleeping"></Final>
        </>
      )
    ).toEqual({
      initial: 'awake',
      states: {
        awake: {},
        sleeping: {
          type: 'final',
        },
      },
    });
  });
});
