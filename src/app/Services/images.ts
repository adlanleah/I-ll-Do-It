import { inject, Injectable } from '@angular/core';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class Images {
  private db = inject(Firestore);
  public dbUser:any;

  async getUserData(uid:string){
    const docRef = doc(this.db,  `users/${uid}`);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return;
    this.dbUser = docSnap.data();
  }
}
