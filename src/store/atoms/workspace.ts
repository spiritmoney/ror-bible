import { IProject } from 'interface/project';
import { IUser } from 'interface/user';
import { atom } from 'recoil';
import { ISquareSwitchPosition } from '../../interface/squareSwitch';
import persistAtom from '../persist/persist';

export const booksSwitchAtom = atom({
  key: 'booksSwitch',
  default: 'left' as ISquareSwitchPosition,
  effects_UNSTABLE: [persistAtom],
});

export const annotationSwitchAtom = atom({
  key: 'annotationSwitch',
  default: 'right' as ISquareSwitchPosition,
  effects_UNSTABLE: [persistAtom],
});
export const vNImageAtom = atom({
  key: 'VNImage',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const projectAtom = atom({
  key: 'projectAtom',
  default: {
    loading: true,
  } as IProject,
  effects_UNSTABLE: [persistAtom],
});

export const cloudProjectVersionAtom = atom({
  key: 'cloudProjectVersionAtom',
  default: {
    loading: true,
  },
  // effects_UNSTABLE: [persistAtom],
});

export const allProjectAtom = atom({
  key: 'allProjectAtom',
  default: [] as any,
  // effects_UNSTABLE: [persistAtom],
});

export const deltaAtom = atom({
  key: 'deltaAtom',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const newProjectModalAtom = atom({
  key: 'newProjectModalAtom',
  default: false,
});
export const settingsModalAtom = atom({
  key: 'settingsModalAtom',
  default: false,
});
export const collabPopupModalAtom = atom({
  key: 'collabPopupModalAtom',
  default: false,
});
export const viewProjectInfoModalAtom = atom({
  key: 'viewProjectInfo',
  default: {
    show: false,
    project: null as IProject | null,
  },
});
export const viewUserInfoModalAtom = atom({
  key: 'viewUserInfo',
  default: {
    show: false,
    user: null as IUser | null,
  },
});
export const notificationsModalAtom = atom({
  key: 'notificationsModalAtom',
  default: false,
});
export const upgradeModalAtom = atom({
  key: 'upgradeModalAtom',
  default: false,
});
export const utilityModalAtom = atom({
  key: 'utilityModalAtom',
  default: false,
});
export const addAnnotationModalAtom = atom({
  key: 'addAnnotationModalAtom',
  default: false,
});
export const addVoiceNoteModalAtom = atom({
  key: 'addVoiceNoteModalAtom',
  default: false,
});
export const addCommentsModalAtom = atom({
  key: 'addCommentsModalAtom',
  default: false,
});

export const lastFiveProjectsAtom = atom({
  key: 'lastFiveProjectsAtom',
  default: {
    loading: true,
  },
});

export const allLocalProjectAtom = atom({
  key: 'allLocalProjectAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const editorSelectedAtom = atom({
  key: 'editorSelectedAtom',
  default: {
    index: 0,
    length: 0,
    value: '',
  } as any,
  // effects_UNSTABLE: [persistAtom],
});

export const editorUserCursorPositionAtom = atom({
  key: 'editorUserCursorPositionAtom',
  default: 0 as any,
  // effects_UNSTABLE: [persistAtom],
});

export const voiceNoteObjAtom = atom({
  key: 'voiceNoteObjAtom',
  default: null as any,
});

export const annotationObjAtom = atom({
  key: 'annotationObjAtom',
  default: null as any,
});

export const dashboardSizeAtom = atom({
  key: 'dashboardSize',
  default: {
    width: 0,
    height: 0,
  },
});

export const collabProjectAtom = atom({
  key: 'collabProjectAtom',
  default: null as IProject | null,
});

export const showUnderReviewAtom = atom({
  key: 'showUnderReviewAtom',
  default: false,
});
