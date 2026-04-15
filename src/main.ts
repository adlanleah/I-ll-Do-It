import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { connectStorageEmulator, getStorage, provideStorage} from '@angular/fire/storage'
import { connectFunctionsEmulator, getFunctions, provideFunctions} from '@angular/fire/functions'
  

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
      // live
      // provideAuth(() => getAuth()), 
      // provideFirestore(() => getFirestore()),
      // provideStorage(() => getStorage()),
      // provideFunctions(()=> getFunctions())

      // emulators
      provideAuth(() =>{
        const auth = getAuth();
        if (location.hostname === 'localhost') {
          connectAuthEmulator(auth, 'http://localhost:9099')
        }
        return auth;
      }),
     provideFirestore(() => {
      const firestore = getFirestore();
      if (location.hostname === 'localhost') {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
     provideStorage(() => {
      const storage = getStorage();
      if (location.hostname === 'localhost') {
        connectStorageEmulator(storage, 'localhost', 9199); 
      }
      return storage;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      if (location.hostname === 'localhost') {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    })
  ],
});
