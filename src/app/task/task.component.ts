import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonHeader,IonContent,IonIcon,IonFooter } from "@ionic/angular/standalone";
import { AuthService } from '../Services/auth';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  imports: [IonHeader, ReactiveFormsModule, IonFooter, IonIcon, IonContent, RouterLink],
})
export class TaskComponent  implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  taskForm = new FormGroup({
    title: new FormControl('', {validators: [Validators.required, Validators.minLength(3)]}),
    description: new FormControl(''),
    deadline: new FormControl<string | null>(null),
    priority: new FormControl<'Low' | 'Medium' | 'High'>('Low')
  });

  priorities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];

  setPriority(level: 'Low' | 'Medium' | 'High') {
  this.taskForm.controls.priority.setValue(level);
}

  async onSave() {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.getRawValue();
      
      try {
        await this.authService.addTask(taskData);
        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Error adding task:', error);
      }
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  constructor() {
    addIcons({addOutline})
   }

  ngOnInit() {}

}
