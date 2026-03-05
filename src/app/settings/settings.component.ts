import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { IonContent, IonIcon, IonFooter, IonHeader, IonAvatar } from "@ionic/angular/standalone";
import { AuthService } from '../Services/auth';
import { addIcons } from 'ionicons';
import {
  calendarClearOutline, calendarOutline, cameraOutline, chevronBackOutline,
  chevronForwardOutline, cloudyOutline, gridOutline, helpCircleOutline,
  informationCircleOutline, logOutOutline, moonOutline, notificationsOutline,
  personOutline, settingsOutline, timerOutline, syncOutline
} from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { Images } from '../Services/images';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [IonContent, IonIcon, IonFooter, IonHeader, IonAvatar, RouterLink],
})
export class SettingsComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  private db = inject(Firestore);
  private storage = inject(Storage);
  imaged = inject(Images)

  isDarkMode = signal(true);
  appVersion = '2.4.0';
  userProfileImage = signal<string | null>(null);
  isAuthReady = signal(false);
  userName = signal('');
  private profileSub: any;

  constructor() {
    addIcons({
      cameraOutline, chevronBackOutline, chevronForwardOutline,
      personOutline, cloudyOutline, notificationsOutline,
      moonOutline, helpCircleOutline, informationCircleOutline,
      logOutOutline, settingsOutline, calendarOutline,
      calendarClearOutline, gridOutline, timerOutline, syncOutline
    });

      effect(async () => {
  const uid = this.authService.currentUser()?.uid;
  if (!uid) return;

  await this.imaged.getUserData(uid);

  this.userProfileImage.set(this.imaged.dbUser?.dp || null);
  this.userName.set(this.imaged.dbUser?.name || '');

  this.isAuthReady.set(true);
});
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    document.documentElement.classList.toggle('dark', this.isDarkMode());
  }

  async logout() {
    await this.authService.logOut();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.profileSub?.unsubscribe();
  }
}