import { AtomEffect } from 'recoil';

/**
 * Forces boolean atoms that back disabled modals to stay closed.
 * Prevents programmatic `true` from opening the overlay (incl. stale writes).
 */
export function blockModalOpenEffect(): AtomEffect<boolean> {
  return ({ setSelf, onSet, getLoadable, node }) => {
    const clamp = () => {
      try {
        if (getLoadable(node).getValue() === true) setSelf(false);
      } catch {
        setSelf(false);
      }
    };
    clamp();
    onSet(() => {
      clamp();
    });
  };
}
