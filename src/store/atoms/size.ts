import { atom } from "recoil";

export const headerHeightAtom = atom({
  key: 'headerHeight',
  default: 0,
  // effects_UNSTABLE: [persistAtom],
});

export const footerHeightAtom = atom({
  key: 'footerHeight',
  default: 0,
  // effects_UNSTABLE: [persistAtom],
});

export const workspaceHeaderHeightAtom = atom({
  key: 'workspaceHeaderHeight',
  default: 0,
  // effects_UNSTABLE: [persistAtom],
});

export const annotationWidthAtom = atom({
  key: 'annotationWidth',
  default: 0,
  // effects_UNSTABLE: [persistAtom],
});
