import { Component, inject, OnInit, signal } from '@angular/core';
import { IonContent, IonIcon, IonFooter, IonHeader, IonAvatar } from "@ionic/angular/standalone";
import { AuthService } from '../Services/auth';
import { Camera, CameraResultType } from "@capacitor/camera";
import { addIcons } from 'ionicons';
import {calendarClearOutline, calendarOutline, cameraOutline, chevronBackOutline, chevronForwardOutline,
  cloudyOutline, gridOutline, helpCircleOutline, informationCircleOutline,
  logOutOutline, moonOutline, notificationsOutline, personOutline,
  settingsOutline, timerOutline
} from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { ref, Storage, uploadBytesResumable} from '@angular/fire/storage'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [IonContent, IonIcon, IonFooter, IonHeader, IonAvatar, RouterLink],
})
export class SettingsComponent implements OnInit {
  authService = inject(AuthService);
  private db = inject(Firestore)
  private storage = inject(Storage);
  isDarkMode  = signal(true);
  appVersion  = '2.4.0';
  userProfileImage = 'assets/icon/Todo-Logo.png';


  async pickImage() {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      quality: 60,
    });

    if (image.webPath) {
      this.userProfileImage = image.webPath;
      localStorage.setItem('profileImage', image.webPath);
    }
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    document.documentElement.classList.toggle('dark', this.isDarkMode());
  }

  async logout() {
    await this.authService.logOut();
  }

  constructor() {
    addIcons({
      cameraOutline, chevronBackOutline, chevronForwardOutline,
      personOutline, cloudyOutline, notificationsOutline,
      moonOutline, helpCircleOutline, informationCircleOutline,
      logOutOutline, settingsOutline, calendarOutline,
      calendarClearOutline, gridOutline, timerOutline
    });
  }

  ngOnInit() {
    const saved = localStorage.getItem('profileImage');
    if (saved) this.userProfileImage = saved;
  }
}