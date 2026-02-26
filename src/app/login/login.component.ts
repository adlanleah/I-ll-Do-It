import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonIcon, IonSpinner } from "@ionic/angular/standalone";
import { AuthService } from '../Services/auth';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline, checkmarkCircleOutline, closeOutline,
  eyeOffOutline, eyeOutline, logoApple
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, IonContent, IonIcon, IonSpinner, RouterLink],
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  showPassword = false;

  loginForm = new FormGroup({
    email:    new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  async onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.getRawValue();
      await this.authService.loginWithEmail(email!, password!);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  constructor() {
    addIcons({
      closeOutline, checkmarkCircleOutline,
      alertCircleOutline, eyeOutline, eyeOffOutline, logoApple
    });
  }

  ngOnInit() {}
}