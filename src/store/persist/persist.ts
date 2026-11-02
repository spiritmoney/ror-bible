import { recoilPersist, PersistStorage } from '../../module/recoil-persist';
import localForageStore from 'localforage';
import { LOCAL_FORAGE_KEY, RECOIL_STATE_KEY } from '../constant';
export const localForage = localForageStore;

localForage.config({
  driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE, localForage.WEBSQL],
  name: LOCAL_FORAGE_KEY,
});
export const { persistAtom } = recoilPersist({
  key: RECOIL_STATE_KEY,
  storage: localForage as PersistStorage,
  parser: (value) => value,
  stringify: (value) => value,
});

export default persistAtom;