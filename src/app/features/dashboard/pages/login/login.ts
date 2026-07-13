import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, TimeoutError, timeout } from 'rxjs';
import { AuthService } from '../../../../core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class Login {
  private static readonly LOGIN_TIMEOUT_MS = 15_000;

  username = '';
  password = '';
  loading = false;
  error: string | null = null;
  currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (!this.username || !this.password) {
      this.error = 'Inserisci username e password';
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService.login(this.username, this.password).pipe(
      timeout(Login.LOGIN_TIMEOUT_MS),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe({
      next: () => {
        void this.router.navigate(['/dashboard']).then((navigated) => {
          if (!navigated) {
            this.error = 'Accesso riuscito, ma non è stato possibile aprire la dashboard. Riprova.';
          }
        }).catch(() => {
          this.error = 'Accesso riuscito, ma non è stato possibile aprire la dashboard. Riprova.';
        });
      },
      error: (err) => {
        if (err instanceof TimeoutError) {
          this.error = 'Il server sta impiegando troppo tempo a rispondere. Riprova.';
        } else if (err.status === 401) {
          this.error = 'Credenziali non valide';
        } else {
          this.error = 'Errore durante il login. Riprova.';
        }
      }
    });
  }
}
