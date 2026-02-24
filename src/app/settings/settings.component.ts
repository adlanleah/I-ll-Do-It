import { Component, inject, OnInit, signal } from '@angular/core';
import { IonContent,IonIcon, IonFooter, IonHeader } from "@ionic/angular/standalone";
import { AuthService } from '../Services/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [IonContent, IonIcon, IonFooter, IonHeader],
})
export class SettingsComponent  implements OnInit {
  authService = inject(AuthService);
  isDarkMode = signal(true);
  appVersion = '2.4.0';


  toggleTheme() {
    this.isDarkMode.update(v => !v);
    // Logic to update the document class for dark mode
    document.documentElement.classList.toggle('dark', this.isDarkMode());
  }

  async logout() {
    await this.authService.logOut();
  }

  constructor() { }

  ngOnInit() {}

}
