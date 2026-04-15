import { initializeApp } from 'firebase-admin/app';
initializeApp();

import { addMeta } from './fns/addMeta';

export const addMetaFunction = addMeta
