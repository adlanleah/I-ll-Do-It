import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { FirebaseError } from '@angular/fire/app';

@Injectable({
  providedIn: 'root',
})
export class Upload {
  authService = inject(AuthService);
  private db = inject(Firestore);
  private storage = inject(Storage);
  public progress = 0;

  async images(event: any){
    const file = event.target.files[0];
    if (!file) {
      console.log('Error Loading File');
      return;
    }

    const uid = this.authService.currentUser()?.uid;
    if (!uid) {
      console.log('No user logged in');
      return;
    }

    //paths in storage
    const filePath = `avatars/${uid}/profile.jpg`;
    const storageRef = ref(this.storage,filePath)
    const uploadTasks = uploadBytesResumable(storageRef, file)
    uploadTasks.on(
      'state_changed',
      (snapShot)=>{
        this.progress = ((snapShot.bytesTransferred / snapShot.totalBytes) * 100);
        // console.log('Upload progress',this.progress)
      },
      (error:FirebaseError) =>{
        console.log(`Tracking ${error}`)
      },
      ()=>{
        getDownloadURL(uploadTasks.snapshot.ref).then(async(downloadUrl)=>{
          await this.updateUser(uid!, downloadUrl)
        }).catch((error:any)=>{
          console.log(error.code);
        })
      }
   
  )}

  private async updateUser(uid: string, dp: string) {
    const userRef = doc(this.db, 'users', uid);
    await updateDoc(userRef, { dp });
  }
}