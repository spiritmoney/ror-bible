/**
 * The BibleDisplay component only understands the XML-converted JSON shape:
 * { book: { will: { name: [ { chapters: { chapter: [...] } }, ... ] } } }
 *
 * Downloaded/cached premium Bible payloads are not guaranteed to be in this
 * shape (some are stored as a flat map of { BookName: { chapter: [verses] } }).
 * Use this guard before handing data to BibleDisplay so mismatched payloads
 * fall back to the bundled local JSON instead of crashing the reader.
 */
export const isValidBibleData = (data: any): boolean =>
  Boolean(data && Array.isArray(data?.book?.will?.name));

const DB_NAME = 'RhapsodyBibleDB';
const DB_VERSION = 2;
const STORE_NAME = 'productData';

const ensureBibleStore = async () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not available in this browser'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () =>
      reject(request.error ?? new Error('IndexedDB open failed'));

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
};

export const getBibleData = async (productSKU: string): Promise<any | null> => {
  if (!productSKU) {
    return null;
  }

  try {
    const db = await ensureBibleStore();

    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get(productSKU);

        getReq.onsuccess = () => resolve(getReq.result ?? null);
        getReq.onerror = () =>
          reject(getReq.error ?? new Error('Failed to read Bible data'));
        tx.onerror = () =>
          reject(tx.error ?? new Error('Failed to read Bible data'));
      });
    } finally {
      db.close();
    }
  } catch (error) {
    console.error('getBibleData failed:', error);
    return null;
  }
};

export const saveBibleData = async (
  productSKU: string,
  data: Record<string, any>
): Promise<void> => {
  if (!productSKU || !data || typeof data !== 'object') {
    throw new Error(
      'A valid product SKU and payload are required to save Bible data'
    );
  }

  try {
    const db = await ensureBibleStore();

    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        store.put(data, productSKU);
        tx.oncomplete = () => resolve();
        tx.onerror = () =>
          reject(tx.error ?? new Error('Failed to save Bible data'));
      });
    } finally {
      db.close();
    }
  } catch (error) {
    console.error('saveBibleData failed:', error);
    throw error;
  }
};
