import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonIcon, IonSpinner } from "@ionic/angular/standalone";
import { AuthService } from '../Services/auth';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {alertCircleOutline, chevronBackOutline, eyeOffOutline, eyeOutline,lockClosedOutline, logoApple, mailOutline, personOutline} from 'ionicons/icons';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [IonContent, ReactiveFormsModule, IonIcon, IonSpinner, RouterLink],
})
export class SignupComponent implements OnInit {
  authService = inject(AuthService);
  showPassword = false;

  signupForm = new FormGroup({
    fullName: new FormControl('',[Validators.required, Validators.minLength(2)]),
    email: new FormControl('',  [Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(8)])
  });

  async onSignup() {
    if (this.signupForm.valid) {
      const { fullName, email, password } = this.signupForm.getRawValue();
      await this.authService.createUserByEmail(email!, password!, fullName!);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  constructor() {
    addIcons({
      chevronBackOutline, alertCircleOutline,
      eyeOutline, eyeOffOutline, logoApple,
      personOutline, mailOutline, lockClosedOutline
    });
  }

  ngOnInit() {}
}