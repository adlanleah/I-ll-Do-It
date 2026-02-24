import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';

export const keepGuard: CanActivateFn = (route, state) => {
const auth = inject(Auth);

return authState(auth).pipe(
  map((user) =>{
    if (user) {
      return true
    } else{
      return false
    }
  })
)


};
