import { onCall } from 'firebase-functions/v2/https';


export const addMeta = onCall(async (event) =>{
    const {name, uid} = event.data;
    return {name, uid};
});
