import { AuthService } from './../Services/auth';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonSearchbar, IonHeader, IonToolbar, IonButton, IonIcon, IonAvatar, IonChip, IonList, IonItem, IonCheckbox, IonLabel, IonBadge, IonFab, IonFabButton, IonFooter, IonTabs, IonTabBar, IonTabButton } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { add, trashOutline } from 'ionicons/icons';

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
  imports: [IonContent, IonFab, IonFabButton, IonIcon, RouterLink],
})
export class DashboardComponent  implements OnInit {
  public authService = inject(AuthService);

  async toggleTask(task: any) {
    await this.authService.updateTaskStatus(task.id, !task.completed);
  }
  constructor() { 
    addIcons({add, trashOutline})
  }

  ngOnInit() {}

}
