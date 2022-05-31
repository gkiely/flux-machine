import { AnyObj, StateChart } from 'src/types';
import fsm, { Final, State, Transition } from '../fsm';

const stateChart = (
  <>
    <State initial id="sleeping">
      <Transition event="walk" target="walking" />
    </State>
    <State id="walking">
      <Transition event="sleep" target="sleeping" />
    </State>
  </>
);

describe('fsm', () => {
  it('transitions from one state to another', () => {
    const service = fsm(stateChart).start();
    service.send('walk');
    expect(service.state.value).toBe('walking');
  });

  it('does not transition when condition does not pass', () => {
    const machine = fsm(stateChart, {
      speed: 0,
    });

    machine
      .when({
        state: 'sleeping',
        event: 'walk',
      })
      .cond(data => data.speed > 1);

    const service = machine.start();
    service.send('walk');

    expect(service.state.value).toBe('sleeping');
  });
  it('updates context with assign', () => {
    const machine = fsm(stateChart, {
      speed: 0,
    });

    machine
      .when({
        state: 'sleeping',
        event: 'walk',
      })
      .assign(data => ({
        speed: data.speed + 1,
      }));

    const service = machine.start();
    service.send('walk');
    expect(service.state.context.speed).toBe(1);
  });
  it('calls an action', () => {
    const machine = fsm(stateChart);
    const fn = jest.fn();

    machine
      .when({
        state: 'sleeping',
        event: 'walk',
      })
      .action(fn);

    const service = machine.start();
    service.send('walk');
    expect(fn).toBeCalledTimes(1);
  });

  it('supports initial', () => {
    const machine = fsm(stateChart);
    expect(machine.get().initial).toBe('sleeping');
    const service = machine.start();
    expect(service.state.value).toBe('sleeping');
  });

  it('supports default initial', () => {
    const sc = (
      <>
        <State id="sleeping" />
        <State id="awake" />
      </>
    );
    const machine = fsm(stateChart);
    expect(machine.get().initial).toBe('sleeping');
    const service = machine.start();
    expect(service.state.value).toBe('sleeping');
  });

  it('supports initial on a different node', () => {
    const sc = (
      <>
        <State id="sleeping" />
        <State initial id="awake" />
      </>
    );
    const machine = fsm(sc);
    expect(machine.get().initial).toBe('awake');
    const service = machine.start();
    expect(service.state.value).toBe('awake');
  });

  it('supports final', () => {
    const stateChart = (
      <>
        <State initial id="awake">
          <Transition event="sleep" target="sleeping" />
        </State>
        <Final id="sleeping" />
      </>
    );
    const machine = fsm(stateChart);
    const service = machine.start();
    service.send('sleep');
    service.send('awake');
    expect(service.state.value).toBe('sleeping');
  });

  /// TODO: add support for invoke, currently xstate/fsm does not support it
  xit('invokes a promise', () => {
    const machine = fsm(
      <>
        <State initial id="sleeping">
          <Transition event="walk" target="walking" />
        </State>
      </>
    );
    const service = machine.start();

    // wip
    machine
      .when({
        state: 'sleeping',
      })
      /// TODO: allow calling send
      .invoke(async () => {
        console.log('invoke');
        try {
          await new Promise(resolve => setTimeout(resolve, 100));
          console.log('hey');
        } catch {}
      });

    machine.start();

    expect(service.state.value).toBe('sleeping');
  });

  it('supports re-using transitions', () => {
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
    const machine = fsm(sc);
    const service = machine.start();
    service.send('end');
    expect(service.state.value).toBe('3');
  });

  it('supports global transitions', () => {
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
    const machine = fsm(sc);
    const fn = jest.fn();
    machine
      .when({
        event: 'end',
      })
      .action(fn);
    const service = machine.start();
    service.send('end');
    expect(service.state.value).toBe('3');
    expect(fn).toBeCalledTimes(1);
  });
});

describe('jsx', () => {
  describe('cond', () => {
    const sc: StateChart = ({ guards }) => {
      return (
        <>
          <State id="sleeping">
            <Transition event="walk" target="walking" cond={guards?.check} />
          </State>
          <State id="walking">
            <Transition event="sleep" target="sleeping" />
          </State>
        </>
      );
    };

    let counter = 0;

    const machine = fsm(sc, null, {
      guards: {
        check: jest.fn(() => counter++),
      },
    });

    it('should only proceed if condition is true', () => {
      const service = machine.start();
      service.send('walk');
      expect(service.state.value).toBe('sleeping');
      service.send('walk');
      expect(service.state.value).toBe('walking');
    });
  });

  describe('action', () => {
    const sc: StateChart = ({ actions }) => {
      return (
        <>
          <State id="sleeping">
            <Transition event="walk" target="walking" action={actions?.walking} />
          </State>
          <State id="walking">
            <Transition event="sleep" target="sleeping" />
          </State>
        </>
      );
    };

    const fn = jest.fn();

    const machine = fsm(
      sc,
      {
        speed: 1,
      },
      {
        actions: {
          walking: fn,
        },
      }
    );

    it('should call function', () => {
      const service = machine.start();
      service.send('walk');
      expect(fn).toBeCalledTimes(1);
      expect(fn).toBeCalledWith({ speed: 1 }, { type: 'walk' });
    });
  });

  describe('assign', () => {
    const sc: StateChart = ({ actions, guards }) => {
      return (
        <>
          <State id="sleeping">
            <Transition event="walk" target="walking" cond={guards?.check} />
            <Transition event="step" target="sleeping" assign={actions?.step} />
          </State>
          <State id="walking">
            <Transition event="sleep" target="sleeping" />
          </State>
        </>
      );
    };

    const machine = fsm(
      sc,
      {
        speed: 0,
      },
      {
        actions: {
          /// TODO: add correct typing for 3rd argument of fsm
          // @ts-expect-error
          step: data => ({ speed: data.speed + 1 }),
        },
        guards: {
          // @ts-expect-error
          check: data => data.speed >= 1,
        },
      }
    );

    it('should assign', () => {
      const service = machine.start();
      service.send('walk');
      expect(service.state.value).toBe('sleeping');
      service.send('step');
      expect(service.state.context).toEqual({ speed: 1 });
      expect(service.state.value).toBe('sleeping');
      service.send('walk');
      expect(service.state.value).toBe('walking');
    });
  });
});
