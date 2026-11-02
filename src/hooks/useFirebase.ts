import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  OrderByDirection,
  Query,
  query,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
  where,
  WhereFilterOp,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { ICollections } from '../interface/firebase';
import { db, storage } from '../service/firebase';

type IAddEdit = {
  data: any;
  id?: string;
  col: ICollections;
};

type IGetUrl = {
  filename: string;
  folder: string;
};

type IFolders = 'profileImages' | 'projectImages' | 'voiceNotes';

type IMakeUpload = {
  file: any;
  fileName: string;
  uniqueName?: string;
  folder: IFolders;
};

type IGet = {
  col: ICollections;
  id?: string;
  queryOptions?: IQueryDatabase;
  queryRaw?: Query<DocumentData>;
};

type IQueryDatabase = {
  find?: string;
  condition?: WhereFilterOp;
  value?: any;
  orderByName?: string;
  orderBySort?: OrderByDirection;
  limitNo?: number;
  start?: any;
  end?: any;
};

export const useFirebase = () => {
  const [lastVisible] = useState<QueryDocumentSnapshot<DocumentData>>();

  const add = ({ col, data, id }: IAddEdit) => {
    if (id) {
      return new Promise((resolve, reject) => {
        setDoc(doc(db, col, id), data)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
    return new Promise((resolve, reject) => {
      const ref = collection(db, col);
      addDoc(ref, data)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  const edit = ({ col, data, id }: IAddEdit) => {
    return new Promise((resolve, reject) => {
      if (!id) {
        reject('id is required');
        return;
      }
      const docRef = doc(db, col, id);
      updateDoc(docRef, data)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  const deleteData = ({ col, id }: { col: ICollections; id: string }) => {
    return new Promise((resolve, reject) => {
      if (!id) {
        reject('id is required');
        return;
      }
      const docRef = doc(db, col, id);
      deleteDoc(docRef)
        .then(() => {
          resolve('Delete success');
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  const makeUpload = ({ file, fileName, folder }: IMakeUpload) => {
    const filename = fileName;
    return new Promise((resolve, reject) => {
      const imageRef = ref(storage, `${folder}/${filename}`);
      uploadBytes(imageRef, file)
        .then(snapshot => {
          resolve({ filename, folder });
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  const getUrl = async ({ filename, folder }: IGetUrl) => {
    return new Promise((resolve, reject) => {
      getDownloadURL(ref(storage, `${folder}/${filename}`))
        .then(url => {
          resolve(url);
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  const getOnSnapshot = async ({ col, id, queryOptions, queryRaw }: IGet) => {
    if (queryOptions) {
      // return new Promise((resolve, reject) => {
        const { find, condition, value, orderByName, orderBySort, limitNo } =
          queryOptions;
        const q = limitNo
          ? query(
              collection(db, col),
              where(find ?? '', condition ?? '==', value),
              orderBy(orderByName ?? 'createdAt', orderBySort ?? 'asc'),
              limit(limitNo)
              // startAfter(start)
            )
          : query(
              collection(db, col),
              where(find ?? '', condition ?? '==', value),
              orderBy(orderByName ?? 'createdAt', orderBySort ?? 'asc')
              // startAt(start),
              // endAt(end)
            );
        onSnapshot(
          q,
          querySnapshot => {
            const arr: any = [];
            querySnapshot.docChanges().forEach(doc => {
              arr.push({ ...doc.doc.data(), id: doc.doc.id });
            });
            // resolve(arr);
          },
          err => {
            // reject(err);
          }
        );
      // });

      try {
        const querySnapshot: any = await onSnapshot(q, querySnapshot => {return querySnapshot})
        const arr: any = [];
        console.log('jkjn',querySnapshot())
        querySnapshot.forEach((doc: any) => {
          arr.push({ ...doc.doc.data(), id: doc.doc.id });
        })
        console.log('jkjn',querySnapshot)
      } catch (error) {
        console.error(error)
      }
    }

    if (queryRaw) {
      return new Promise((resolve, reject) => {
        onSnapshot(
          queryRaw,
          querySnapshot => {
            const arr: any = [];
            querySnapshot.docChanges().forEach(doc => {
              arr.push({ ...doc.doc.data(), id: doc.doc.id });
            });
            resolve(arr);
          },
          err => {
            reject(err);
          }
        );
      });
    }

    if (id) {
      return new Promise((resolve, reject) => {
        onSnapshot(
          doc(db, col, id),
          data => {
            resolve({ ...data.data(), id: data.id });
          },
          err => {
            reject(err.message);
          }
        );
      });
    }

    return new Promise((resolve, reject) => {
      const ref = collection(db, col);
      onSnapshot(
        ref,
        data => {
          resolve(data.docs.map(el => ({ ...el.data(), id: el.id })));
        },
        err => {
          reject(err.message);
        }
      );
    });
  };

  const getOnce = ({ col, id, queryOptions, queryRaw }: IGet) => {
    if (queryOptions) {
      return new Promise((resolve, reject) => {
        const { find, condition, value, orderByName, orderBySort, limitNo } =
          queryOptions;
        const q = limitNo
          ? query(
              collection(db, col),
              where(find ?? '', condition ?? '==', value),
              orderBy(orderByName ?? 'createdAt', orderBySort ?? 'asc'),
              limit(limitNo)
              // startAfter(start)
            )
          : query(
              collection(db, col),
              where(find ?? '', condition ?? '==', value),
              orderBy(orderByName ?? 'createdAt', orderBySort ?? 'asc')
              // startAt(start),
              // endAt(end)
            );
        getDocs(queryRaw ?? q)
          .then(data => {
            const arr: any = [];
            // setLastVisible(data.docs[data.docs.length - 1]);
            data.forEach(doc => {
              arr.push({ ...doc.data(), id: doc.id });
            });
            resolve(arr);
          })
          .catch(err => {
            reject(err.message);
          });
      });
    }
    if (queryRaw) {
      return new Promise((resolve, reject) => {
        getDocs(queryRaw)
          .then(data => {
            const arr: any = [];
            // setLastVisible(data.docs[data.docs.length - 1]);
            data.forEach(doc => {
              arr.push({ ...doc.data(), id: doc.id });
            });
            resolve(arr);
          })
          .catch(err => {
            reject(err.message);
          });
      });
    }

    if (id) {
      return new Promise((resolve, reject) => {
        const ref = doc(db, col, id);
        getDoc(ref)
          .then(data => {
            if (!data.exists()) return resolve(null);
            resolve({ ...data.data(), id: data.id });
          })
          .catch(err => {
            reject(err.message);
          });
      });
    }

    return new Promise((resolve, reject) => {
      getDocs(collection(db, col))
        .then(data => {
          const arr: any = [];
          data.forEach(doc => {
            arr.push({ ...doc.data(), id: doc.id });
          });
          resolve(arr);
        })
        .catch(err => {
          reject(err.message);
        });
    });
  };

  return {
    add,
    edit,
    deleteData,
    getOnSnapshot,
    getUrl,
    getOnce,
    makeUpload,
    lastVisible,
  };
};
