import { inject, Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root',
})
export class Cloud {
  function = inject(Functions)

  async bugRonnie(){
  //   const call = httpsCallable(this.function, "addMetaFunction");
  //   const res = await call()
  //   console.log(`This is your ${res.data}`)
  // }
  try {
    const call = httpsCallable(this.function, "addMetaFunction");
    const res = await call({name: 'ronnie', uid: 'uid'}); 
    console.log(`Success:`, res.data);
  } catch (error) {
    console.error("Alert error:", error);
  }
  }
}
