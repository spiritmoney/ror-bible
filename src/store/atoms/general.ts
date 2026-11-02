import { atom } from 'recoil';
import persistAtom from '../persist/persist';
import { ConcordanceItem } from 'screens/JsonBibleDisplay/StrongsDictionary';

export const lockAtom = atom({
  key: 'lock',
  default: false,
  effects_UNSTABLE: [persistAtom],
});
export const userTable = atom({
  key: 'showTable',
  default: 'dashboard',
  effects_UNSTABLE: [persistAtom],
});
export const storeBackAtom = atom({
  key: 'storeBackAtom',
  default: '',
  effects_UNSTABLE: [persistAtom],
});
export const storeCartAtom = atom({
  key: 'storeCart',
  default: '',
  effects_UNSTABLE: [persistAtom],
});
export const readModeAtom = atom({
  key: 'readerMode',
  default: false,
  effects_UNSTABLE: [persistAtom],
});
export const showReaderModal = atom({
  key: 'showreaderMode',
  default: false,
  effects_UNSTABLE: [persistAtom],
});
export const showAudioPlayer = atom({
  key: 'showAudioPlayer',
  default: true,
  effects_UNSTABLE: [persistAtom],
});
export const showReaderSettingsModal = atom({
  key: 'readerSettingsdisplay',
  default: false,
});
export const SettingsActiveStateModal = atom({
  key: 'readerSettingsModal',
  default: null,
  effects_UNSTABLE: [persistAtom],
});
export const readBookAtom = atom({
  key: 'bookMode',
  default: '',
  effects_UNSTABLE: [persistAtom],
});

export const readChapterAtom = atom({
  key: 'chapMode',
  default: '1',
  effects_UNSTABLE: [persistAtom],
});
export const totalVersesAtom = atom({
  key: 'TotalVerses',
  default: 1,
  effects_UNSTABLE: [persistAtom],
});
export const selectedVerseAtom = atom<number | null>({
  key: 'selectedVerseAtom',
  default: null,
  effects_UNSTABLE: [persistAtom],
});
export const referenceVerseAtom = atom<number | null>({
  key: 'referenceVerseAtom',
  default: null,
  effects_UNSTABLE: [persistAtom],
});
// the modal of the Selected id for the verse in focus (book+chap+verse)
export const verseInFocusAtom = atom<number | null>({
  key: 'verseInFocusAtom',
  default: null,
  effects_UNSTABLE: [persistAtom],
});
export const selectedStrongsAtom = atom({
  key: 'selectedStrongsAtom',
  default: '',
  effects_UNSTABLE: [persistAtom],
});
export const selectedStrongsMeaning = atom({
  key: 'selectedStrongsMeaning',
  default: '',
  effects_UNSTABLE: [persistAtom],
});
export const showStrongsAtom = atom({
  key: 'showStrongsAtom',
  default: true,
  effects_UNSTABLE: [persistAtom],
});
export const currentBookAtom = atom({
  key: 'currBook',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});
export const currentChapterAtom = atom({
  key: 'currChap',
  default: 1,
  effects_UNSTABLE: [persistAtom],
});
export const currentChapterLengthAtom = atom({
  key: 'currChapLength',
  default: 1,
  effects_UNSTABLE: [persistAtom],
});
export const bibleContentAtom = atom({
  key: 'jsonBibleContent',
  default: null,
});

export const layoutViewAtom = atom({
  key: 'setLayoutView',
  default: 'A',
  effects_UNSTABLE: [persistAtom],
});
export const activeNavAtom = atom({
  key: 'setactiveNavAtom',
  default: 'home',
  effects_UNSTABLE: [persistAtom],
});

export const DarkThemeAtom = atom({
  key: 'darkThemeAtom',
  default: false,
  effects_UNSTABLE: [persistAtom],
});
export const SideNavAtom = atom({
  key: 'SideNavAtom',
  default: true,
  effects_UNSTABLE: [persistAtom],
});
export const SetNavAtom = atom({
  key: 'SetNavAtom',
  default: 'multi_layout',
  // effects_UNSTABLE: [persistAtom],
});
export const ProdSKUAtom = atom({
  key: 'SetProdSKUAtom',
  default: '',
  effects_UNSTABLE: [persistAtom],
});
export const FontSizeAtom = atom({
  key: 'SetFontSizeAtom',
  default: '16px',
  effects_UNSTABLE: [persistAtom],
});
export const FontTypeAtom = atom({
  key: 'SetFontTypeAtom',
  default: 'Raleway',
  effects_UNSTABLE: [persistAtom],
});
export const WordofChristAtom = atom({
  key: 'WordofChristAtom',
  default: '#b11902',
  effects_UNSTABLE: [persistAtom],
});
export const highlightColorAtom = atom({
  key: 'highlightSelector',
  default: '#b11902',
  effects_UNSTABLE: [persistAtom],
});
export const highlightedVersesState = atom({
  key: 'highlightedVersesState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const bookMarkedVersesAtom = atom({
  key: 'bookMarkedVerses',
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const verseDisplayState = atom({
  key: 'verseDisplayState',
  default: 'one',
  effects_UNSTABLE: [persistAtom],
});

export const referenceStateAtom = atom({
  key: 'referenceStateAtom',
  default: true,
  effects_UNSTABLE: [persistAtom],
});

export const condordanceResultAtom = atom<ConcordanceItem[] | null>({
  key: 'concordStateAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const UpdateProfileAtom = atom({
  key: 'updateProfileAtom',
  default: false,
  // effects_UNSTABLE: [persistAtom],
});
export const accRenewAtom = atom({
  key: 'accRenewAtom',
  default: false,
  // effects_UNSTABLE: [persistAtom],
});
export const accSuspendAtom = atom({
  key: 'accSuspendAtom',
  default: false,
  // effects_UNSTABLE: [persistAtom],
});
export const createTeam = atom({
  key: 'createTeamAtom',
  default: false,
  // effects_UNSTABLE: [persistAtom],
});
export const inviteMembers = atom({
  key: 'inviteMembersAtom',
  default: false,
  // effects_UNSTABLE: [persistAtom],
});
export const ReviewModeAtom = atom({
  key: 'reveiwModeAtom',
  default: true,
  // effects_UNSTABLE: [persistAtom],
});
export const EditPNAtom = atom({
  key: 'editPNAtom',
  default: true,
  // effects_UNSTABLE: [persistAtom],
});
export const ReviewPNAtom = atom({
  key: 'reviewPNAtom',
  default: true,
  // effects_UNSTABLE: [persistAtom],
});
export const SoundPNAtom = atom({
  key: 'soundPNAtom',
  default: true,
  // effects_UNSTABLE: [persistAtom],
});
export const PushNAtom = atom({
  key: 'pushNAtom',
  default: true,
  // effects_UNSTABLE: [persistAtom],
});

export const countriesAtom = atom({
  key: 'countries',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const adminSideNavOverlayAtom = atom({
  key: 'adminSideNavOverlay',
  default: false,
  // effects_UNSTABLE: [persistAtom],
});

export const adminSideNavOverlayExpandAtom = atom({
  key: 'adminSideNavOverlayExpand',
  default: '',
  // effects_UNSTABLE: [persistAtom],
});

export const forgotPasswordEmailAtom = atom({
  key: 'forgotPasswordEmail',
  default: '',
  effects_UNSTABLE: [persistAtom],
});

export const copyContactAtom = atom({
  key: 'copyContact',
  default: false,
  // effects_UNSTABLE: [persistAtom],
});

export const avatarColorAtom = atom({
  key: 'avatarColorAtom',
  default: '',
  // effects_UNSTABLE: [persistAtom],
});

export const libraryAtom = atom({
  key: 'libraryAtom',
  default: false,
  // effects_UNSTABLE: [persistAtom],
});
