import { parseJSX, State, Transition } from '../fsm';

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

describe('parseJSX', () => {
  it('should parse empty JSX', () => {
    expect(parseJSX(<></>)).toEqual({
      initial: '',
      states: {},
    });
  });

  it('should parse a single state node', () => {
    expect(
      parseJSX(
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
      parseJSX(
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
      parseJSX(
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
      parseJSX(
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
      parseJSX(
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
});

xdescribe('fsm', () => {});
xdescribe('parseSCXML', () => {});
