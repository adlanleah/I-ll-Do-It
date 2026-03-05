import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { IonContent, IonIcon, IonHeader, IonFooter, IonAvatar } from "@ionic/angular/standalone";
import { RouterLink } from '@angular/router';
import { AuthService } from '../Services/auth';
import { Upload } from '../Services/upload';
import { doc, docData, Firestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline, cameraOutline, syncOutline, pencilOutline,
  checkmarkOutline, closeOutline, personOutline, mailOutline,
  calendarOutline, checkmarkCircleOutline, trophyOutline,
  gridOutline, calendarClearOutline, analyticsOutline, settingsOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { Images } from '../Services/images';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [IonContent, IonIcon, IonHeader, IonFooter, IonAvatar, RouterLink, FormsModule],
})
export class ProfileComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  demoUpload = inject(Upload);
  private db = inject(Firestore);
  private storage = inject(Storage);
  imaged = inject(Images)

  userProfileImage = signal<string | null>(null);
  isUploadingAvatar = signal(false);
  isAuthReady = signal(false);
  isEditingName = signal(false);
  isSavingName = signal(false);
  editedName = signal('');
  saveSuccess = signal(false);
  public dbUser:any;

  // stats from tasks
  completedCount = signal(0);
  activeCount = signal(0);

  private profileSub: any;

  constructor() {
    addIcons({
      chevronBackOutline, cameraOutline, syncOutline, pencilOutline,
      checkmarkOutline, closeOutline, personOutline, mailOutline,
      calendarOutline, checkmarkCircleOutline, trophyOutline,
      gridOutline, calendarClearOutline, analyticsOutline, settingsOutline
    });
effect(async () =>{
      const user = this.authService.currentUser();
      if(user){
        const uid= user.uid;
        await this.imaged.getUserData(uid)
        this.dbUser = this.imaged.dbUser;
        this.userProfileImage.set(this.dbUser.dp);
        console.log(this.dbUser)
      }
})
    
    effect(() => {      
      // sync stats from tasks signal
      const tasks = this.authService.tasks();
      this.completedCount.set(tasks.filter((t: any) => t.completed).length);
      this.activeCount.set(tasks.filter((t: any) => !t.completed).length);

      //   // prefill name
      //   if (!this.isEditingName()) {
      //     this.editedName.set(userData?.name || this.authService.currentUser()?.displayName || '');
      //   }
      // });
    });
  }

  async uploadvatar(event: any) {
    this.isUploadingAvatar.set(true);
    this.demoUpload.images(event);
    this.isUploadingAvatar.set(false);
    // try {
    //   const newUrl = await this.demoUpload.images(event);
    //   if (newUrl) this.userProfileImage.set(newUrl);
    // } finally {
    //   this.isUploadingAvatar.set(false);
    // }
  }

  startEditing() {
    this.isEditingName.set(true);
  }

  cancelEditing() {
    this.isEditingName.set(false);
  }

  async saveName() {
    const uid = this.authService.currentUser()?.uid;
    const name = this.editedName().trim();
    if (!uid || !name) return;

    this.isSavingName.set(true);
    try {
      const userRef = doc(this.db, 'users', uid);
      await updateDoc(userRef, { name });
      this.isEditingName.set(false);
      this.saveSuccess.set(true);
      setTimeout(() => this.saveSuccess.set(false), 2000);
    } catch (e) {
      console.log('Error saving name', e);
    } finally {
      this.isSavingName.set(false);
    }
  }


  async ngOnInit() {
    // await this.getUserData();
  }

  ngOnDestroy() {
    this.profileSub?.unsubscribe();
  }
}