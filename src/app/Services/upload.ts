import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth';
import { Firestore } from '@angular/fire/firestore';
import { ref, Storage, uploadBytesResumable} from '@angular/fire/storage'

@Injectable({
  providedIn: 'root',
})
export class Upload {
  authService = inject(AuthService);
  private db = inject(Firestore)
  private storage = inject(Storage);
  private  userID = this.authService.currentUser()?.uid;

  async images(event:any){
    const file = event.target.files[0]
    if (!file){
      console.log("Error Loading File")
      return
    }

    const filePath = `anything/${file.name}`
    const storageRef = ref(this.storage,filePath)
    const uploadTasks = uploadBytesResumable(storageRef, file)
    uploadTasks.on(
      'state_changed',
      (snapShot)=>{
        // we can track upload progress from here
      }
    )
  } 
  
}
