import fsm, { State, Transition } from '../fsm';

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

  // it('invokes a promise', () => {
  //   expect(1).toEqual(2);
  // });
});
