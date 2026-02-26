import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { IonHeader, IonContent, IonIcon, IonFooter } from "@ionic/angular/standalone";
import { AuthService } from '../Services/auth';
import { addIcons } from 'ionicons';
import {
  addOutline, calendarOutline, chevronForwardOutline, chevronBackOutline,
  chevronUpOutline, chevronDownOutline, pricetagOutline, timeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  imports: [IonHeader, ReactiveFormsModule, IonFooter, IonIcon, IonContent, RouterLink, DatePipe, DecimalPipe],
})
export class TaskComponent implements OnInit {
  authService = inject(AuthService);
  router      = inject(Router);

  taskForm = new FormGroup({
    title:       new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
    description: new FormControl(''),
    deadline:    new FormControl<string | null>(null),
    priority:    new FormControl<'Low' | 'Medium' | 'High'>('Low'),
    category:    new FormControl<string | null>(null),
  });

  priorities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];

  //Date Picker
  showDatePicker = false;
  pickerViewDate = new Date();   // month being displayed
  pickerSelectedDate: Date | null = null;
  pickerHour   = 12;             // 1–12
  pickerMinute = 0;              // 0–59
  pickerAmPm: 'AM' | 'PM' = 'PM';

  //Calendar
  get pickerDays(): (Date | null)[] {
    const y = this.pickerViewDate.getFullYear();
    const m = this.pickerViewDate.getMonth();
    const firstDow   = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const padding = Array<null>(firstDow).fill(null);
    const days    = Array.from({ length: daysInMonth }, (_, i) => new Date(y, m, i + 1));
    return [...padding, ...days];
  }

  //Pickers still
  isPickerToday(d: Date)    { return d.toDateString() === new Date().toDateString(); }
  isPickerSelected(d: Date) { return !!this.pickerSelectedDate && d.toDateString() === this.pickerSelectedDate.toDateString(); }
  isPickerPast(d: Date)     {
    const today = new Date(); today.setHours(0,0,0,0);
    return d < today;
  }

  openDatePicker() {
    const existing = this.taskForm.controls.deadline.value;
    if (existing) {
      const d = new Date(existing);
      this.pickerSelectedDate = d;
      this.pickerViewDate     = new Date(d.getFullYear(), d.getMonth(), 1);
      const h = d.getHours();
      this.pickerAmPm  = h >= 12 ? 'PM' : 'AM';
      this.pickerHour  = h % 12 || 12;
      this.pickerMinute = d.getMinutes();
    } else {
      const now = new Date();
      this.pickerSelectedDate = null;
      this.pickerViewDate     = new Date(now.getFullYear(), now.getMonth(), 1);
      this.pickerHour   = 12;
      this.pickerMinute = 0;
      this.pickerAmPm   = 'PM';
    }
    this.showDatePicker = true;
  }

  closeDatePicker() { this.showDatePicker = false; }

  changePickerMonth(delta: number) {
    const d = this.pickerViewDate;
    this.pickerViewDate = new Date(d.getFullYear(), d.getMonth() + delta, 1);
  }

  selectPickerDate(d: Date) {
    if (this.isPickerPast(d)) return;
    this.pickerSelectedDate = d;
  }

  adjustHour(delta: number) {
    this.pickerHour = ((this.pickerHour - 1 + delta + 12) % 12) + 1;
  }

  adjustMinute(delta: number) {
    this.pickerMinute = (this.pickerMinute + delta * 5 + 60) % 60;
  }

  confirmDate() {
    if (!this.pickerSelectedDate) { this.closeDatePicker(); return; }

    const date = new Date(this.pickerSelectedDate);
    let hours  = this.pickerHour % 12;
    if (this.pickerAmPm === 'PM') hours += 12;
    date.setHours(hours, this.pickerMinute, 0, 0);
    this.taskForm.controls.deadline.setValue(date.toISOString());
    this.closeDatePicker();
  }

  // Priority Levels
  setPriority(level: 'Low' | 'Medium' | 'High') {
    this.taskForm.controls.priority.setValue(level);
  }

  // Saving data
  async onSave() {
    if (this.taskForm.valid) {
      try {
        await this.authService.addTask(this.taskForm.getRawValue());
        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Error adding task:', error);
      }
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  constructor() {
    addIcons({
      addOutline, calendarOutline, chevronForwardOutline, chevronBackOutline,
      chevronUpOutline, chevronDownOutline, pricetagOutline, timeOutline
    });
  }

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state?.['prefilledDate']) {
      const d = new Date(nav.extras.state['prefilledDate']);
      this.taskForm.patchValue({ deadline: d.toISOString() });
    }
  }
}