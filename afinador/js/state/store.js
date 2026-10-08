/** Store mínimo e observável para o estado do aplicativo. */
export function createStore(initial) {
  let state = initial;
  const listeners = new Set();

  return {
    get: () => state,
    set(patch) {
      const next = { ...state, ...patch };
      const changed = Object.keys(patch).filter((key) => !Object.is(state[key], next[key]));
      if (!changed.length) return;
      const prev = state;
      state = next;
      for (const listener of listeners) listener(state, prev, changed);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
