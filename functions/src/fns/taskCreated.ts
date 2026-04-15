import { getFirestore, onDocumentCreated } from 'firebase-functions/firestore';
export const db = getFirestore();

export const taskCreated = onDocumentCreated('', async(event)=>{});