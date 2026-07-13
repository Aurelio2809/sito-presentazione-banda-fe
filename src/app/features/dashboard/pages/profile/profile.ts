import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services';
import { UserResponse } from '../../../../core/models';
import { UiFeedbackService } from '../../components/ui-feedback/ui-feedback.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: false,
})
export class Profile implements OnInit {
  user: UserResponse | null = null;
  loading = true;
  
  // Form per modifica profilo
  editMode = false;
  editEmail = '';
  
  // Form per cambio password
  showPasswordForm = false;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordError = '';
  
  // Settings (salvati localmente per ora)
  settings = {
    emailNotifications: true,
    newMessageAlert: true,
    eventReminders: true,
  };
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private feedback: UiFeedbackService
  ) {}
  
  ngOnInit(): void {
    this.loadUser();
  }
  
  loadUser(): void {
    this.loading = true;
    
    // Prima controlla se l'utente è già nel BehaviorSubject
    const cachedUser = this.authService.currentUserValue;
    if (cachedUser) {
      this.user = cachedUser;
      this.editEmail = cachedUser.email || '';
      this.loading = false;
      return;
    }
    
    // Altrimenti fai la chiamata HTTP
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.editEmail = user?.email || '';
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore caricamento profilo:', err);
        this.loading = false;
      }
    });
  }
  
  getRoleLabel(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Amministratore';
      case 'USER': return 'Utente';
      default: return role;
    }
  }
  
  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode && this.user) {
      this.editEmail = this.user.email;
    }
  }
  
  saveProfile(): void {
    if (!this.editEmail.trim()) return;
    
    this.authService.updateProfile({ email: this.editEmail }).subscribe({
      next: (user) => {
        this.user = user;
        this.editMode = false;
        this.feedback.toast('Profilo aggiornato con successo', 'success');
      },
      error: (err) => {
        this.feedback.toast(err.error?.message || 'Errore durante l\'aggiornamento', 'error');
      }
    });
  }
  
  togglePasswordForm(): void {
    this.showPasswordForm = !this.showPasswordForm;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError = '';
  }
  
  changePassword(): void {
    this.passwordError = '';
    
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError = 'Compila tutti i campi';
      return;
    }
    
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Le password non coincidono';
      return;
    }
    
    if (this.newPassword.length < 6) {
      this.passwordError = 'La nuova password deve avere almeno 6 caratteri';
      return;
    }
    
    this.authService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.feedback.toast('Password cambiata con successo', 'success');
        this.togglePasswordForm();
      },
      error: (err) => {
        this.passwordError = err.error?.message || 'Errore durante il cambio password';
      }
    });
  }

  saveSettings(): void {
    // Per ora salviamo solo localmente - in futuro si può estendere con un endpoint BE
    localStorage.setItem('dashboardSettings', JSON.stringify(this.settings));
    this.feedback.toast('Impostazioni salvate', 'success');
  }
  
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/dashboard/login']);
      },
      error: () => {
        // Anche in caso di errore, naviga al login
        this.router.navigate(['/dashboard/login']);
      }
    });
  }
}
