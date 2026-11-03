import { atom } from 'recoil';
import persistAtom from '../persist/persist';

export const userAtom = atom({
  key: 'user',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const kingschatTokensAtom = atom({
  key: 'kingschatTokens',
  default: {} as any,
  // effects_UNSTABLE: [persistAtom],
});

export const isLoggedInAtom = atom({
  key: 'isLoggedInAtom',
  default: 'false' as 'loading' | 'false' | 'true',
  // effects_UNSTABLE: [persistAtom],
});

export const userSettingsAtom = atom({
  key: 'userSettingsAtom',
  default: null as {
    [key: string]: any;
} | null,
  // effects_UNSTABLE: [persistAtom],
});

// export const invitedUser = atom({
//   key: 'invitedUser',
//   default: [
//     index: '',
//     length: '',
//     value: '',
//   ] | any
//   // effects_UNSTABLE: [persistAtom],
// });


