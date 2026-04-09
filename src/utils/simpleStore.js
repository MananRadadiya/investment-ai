import { useState, useCallback, useSyncExternalStore } from 'react';

// Minimal state management — no external deps needed
export function create(initialState) {
  let state = { ...initialState };
  const listeners = new Set();

  const getState = () => state;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const setState = (partial) => {
    const next = typeof partial === 'function' ? partial(state) : partial;
    state = { ...state, ...next };
    listeners.forEach((l) => l());
  };

  return function useStore(selector) {
    const selected = useSyncExternalStore(
      subscribe,
      selector ? () => selector(getState()) : getState,
    );
    return selector ? selected : [selected, setState];
  };
}
