import { Component, inject, OnInit, signal } from '@angular/core';
import { IonContent, IonIcon, IonFooter, IonHeader, IonAvatar } from "@ionic/angular/standalone";
import { AuthService } from '../Services/auth';
import {Camera, CameraResultType} from "@capacitor/camera"
import { addIcons } from 'ionicons';
import { add, calendarOutline, listOutline, settingsOutline, timerOutline, trashOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [IonContent, IonIcon, IonFooter, IonHeader, IonAvatar, IonHeader, RouterLink],
})
export class SettingsComponent  implements OnInit {
  authService = inject(AuthService);
  isDarkMode = signal(true);
  appVersion = '2.4.0';

  userProfileImage: string = "assets/icon/Todo-Logo.png";

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
    addIcons({add, trashOutline, settingsOutline, calendarOutline, listOutline, timerOutline})
   }

  ngOnInit() {
     const savedImage = localStorage.getItem('profileImage');
  if (savedImage) {
    this.userProfileImage = savedImage;
  }
  }

}
