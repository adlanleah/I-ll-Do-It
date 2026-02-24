import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideFirebaseApp(() => initializeApp({ 
      projectId: "eazimo-1d47c", 
      appId: "1:765318352295:web:499863040cf1fcd9147a82", 
      storageBucket: "eazimo-1d47c.appspot.com", 
      apiKey: "AIzaSyBYsKCXIQbntNtbUj0HPWD9v15kS0GQbMM", 
      authDomain: "eazimo-1d47c.firebaseapp.com", 
      messagingSenderId: "765318352295", 
      measurementId: "G-SXRPYM21SP" })), 
      provideAuth(() => getAuth()), 
      provideFirestore(() => getFirestore()),
  ],
});
