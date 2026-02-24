import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { closeOutline, arrowForwardOutline, checkmarkSharp } from 'ionicons/icons';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  imports: [IonContent, IonIcon, RouterLink],
})
export class LandingComponent implements OnInit {
  constructor() {
    addIcons({ closeOutline, arrowForwardOutline, checkmarkSharp });
   }
   
  ngOnInit() {}
}