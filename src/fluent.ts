import { WhenArgs } from './types';

export const fluent = (machineConfig: any) => {
  const config = { ...machineConfig };
  return {
    action(fn: () => any) {
      return this;
    },
    assign(fn: () => any) {
      return this;
    },
    catch() {
      return this;
    },
    cond() {
      return this;
    },
    // Alias for cond
    condition(...args: any) {
      this.condition(...args);
      return this;
    },
    delay() {
      return this;
    },
    get: () => config,
    entry() {
      return this;
    },
    exit() {
      return this;
    },
    invoke() {
      return this;
    },
    then() {
      return this;
    },
    when({ state, event }: WhenArgs) {
      return this;
    },
  };
};
