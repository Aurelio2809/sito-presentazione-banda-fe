import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from '../services';

/**
 * Guard per la pagina di login.
 * Se l'utente è già autenticato, redirect alla dashboard.
 */
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.checkAuth().pipe(
      map(user => {
        if (user) {
          // Già autenticato, redirect a dashboard
          return this.router.createUrlTree(['/dashboard']);
        }
        return true;
      }),
      catchError(() => {
        // Non autenticato, può accedere al login
        return of(true);
      })
    );
  }
}
