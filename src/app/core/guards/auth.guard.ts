import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../services';

export const AuthGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loginUrl = router.createUrlTree(['/dashboard/login']);

  return authService.checkAuth().pipe(
    map(user => user ? true : loginUrl),
    catchError(() => of(loginUrl))
  );
};
