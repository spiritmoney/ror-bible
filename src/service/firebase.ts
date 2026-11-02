import firebaseConfig from "../config/firebase";
import { initializeApp } from "firebase/app";
import { getFirestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseApp = initializeApp(firebaseConfig);


const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp)
enableMultiTabIndexedDbPersistence(db);

export { db, storage };
