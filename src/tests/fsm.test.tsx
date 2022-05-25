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

  it('invokes a promise', () => {
    const machine = fsm(stateChart);
    const service = machine.start();

    // wip
    // machine.when({
    //   state: 'sleeping',
    // })
    // .invoke(async (data, send) => {
    //   try {
    //     await new Promise(resolve => setTimeout(resolve, 100));
    //     send('walk');
    //   } catch {
    //     send('sleep');
    //   }
    // })

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
