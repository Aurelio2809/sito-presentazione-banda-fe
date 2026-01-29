import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthService } from '../services';

export const AuthGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  console.log('=== AuthGuard CHIAMATO ===');
  console.log('[AuthGuard] URL richiesto:', state.url);
  
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const loginUrl = router.createUrlTree(['/dashboard/login']);
  
  console.log('[AuthGuard] Chiamo checkAuth()...');
  
  return authService.checkAuth().pipe(
    tap(user => console.log('[AuthGuard] checkAuth() risposta:', user)),
    map(user => {
      if (user) {
        console.log('[AuthGuard] ✓ Utente autenticato:', user.username);
        return true;
      }
      console.log('[AuthGuard] ✗ Nessun utente, redirect a login');
      return loginUrl;
    }),
    catchError((error) => {
      console.log('[AuthGuard] ✗ ERRORE HTTP:', error?.status, error?.message);
      console.log('[AuthGuard] Redirect a /dashboard/login');
      return of(loginUrl);
    })
  );
};
