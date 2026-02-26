import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth';
import { IonContent, IonFab, IonHeader, IonToolbar, IonBackButton, IonButtons, IonButton }from "@ionic/angular/standalone";
import { DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { addOutline, arrowBackOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { IonFabButton, IonIcon, IonTitle } from "@ionic/angular/standalone";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [IonHeader, IonContent, DatePipe, IonFab, IonFabButton, IonIcon, IonToolbar, IonBackButton, IonButtons, IonTitle, IonButton]
})
export class CalendarComponent  implements OnInit {
  public authService = inject(AuthService);
  private router = inject(Router);
  viewDate = signal(new Date());
  selectedDate = signal(new Date());

  // calculate the days
  calendarDays = computed(() => {
    const date = this.viewDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDayCount = new Date(year, month + 1, 0).getDate();
    
    // new entries
    const padding = Array(firstDayIndex).fill(null);
    const days = Array.from({ length: lastDayCount }, (_, i) => new Date(year, month, i + 1));
    
    return [...padding, ...days];
  });

  // Filter tasks based selected date
  tasksForSelectedDate = computed(() => {
    const selected = this.selectedDate().toDateString();
    return this.authService.tasks().filter(t => 
      t.dueDate && new Date(t.dueDate).toDateString() === selected
    );
  });

  changeMonth(delta: number) {
    const current = this.viewDate();
    this.viewDate.set(new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  selectDay(date: Date) {
    this.selectedDate.set(date);
  }
  
  goToAddTask() {
    this.router.navigate(['/add-task'], { 
      state: { prefilledDate: this.selectedDate().toISOString() } 
    });
  }

  isToday(date: Date | null): boolean {
    return !!date && date.toDateString() === new Date().toDateString();
  }

  hasTasks(date: Date | null): boolean {
    if (!date) return false;
    const dStr = date.toDateString();
    return this.authService.tasks().some(t => t.dueDate && new Date(t.dueDate).toDateString() === dStr);
  }

  constructor() { }

  ngOnInit() {
    addIcons({addOutline, arrowBackOutline, chevronBackOutline, chevronForwardOutline})
  }

}
