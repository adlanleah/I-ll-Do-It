import { AuthService } from './../Services/auth';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon, IonFab, IonFabButton, IonAvatar, IonButton } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { add, analyticsOutline, calendarClearOutline, calendarOutline, checkmarkSharp, grid, listOutline, personOutline, searchOutline, settingsOutline, timeOutline, timerOutline, trashOutline } from 'ionicons/icons';

interface Task {
  id: number;
  title: string;
  time: string;
  category: string;
  priority?: 'High' | 'Medium' | 'Low';
  completed: boolean;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [IonContent, IonFab, IonFabButton, IonIcon, RouterLink, IonAvatar],
})
export class DashboardComponent  implements OnInit {
  public authService = inject(AuthService);
   userProfileImage: string = "assets/icon/Todo-Logo.png";

  async toggleTask(task: any) {
    await this.authService.updateTaskStatus(task.id, !task.completed);
  }

  constructor() { 
    addIcons({add, trashOutline, grid ,calendarClearOutline, analyticsOutline, personOutline, settingsOutline, searchOutline, checkmarkSharp,timeOutline})
  }

  ngOnInit() {
    const savedImage = localStorage.getItem('profileImage');
  if (savedImage) {
    this.userProfileImage = savedImage;
  }
  }

}
