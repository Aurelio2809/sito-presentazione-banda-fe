import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: false,
})
export class Profile {
  user = {
    name: 'Admin Banda',
    email: 'admin@bandacasalidelmanco.it',
    role: 'Amministratore',
    avatar: '',
    joinDate: '2020-01-15',
  };

  settings = {
    emailNotifications: true,
    newMessageAlert: true,
    eventReminders: true,
  };

  saveSettings(): void {
    // Placeholder: salvataggio impostazioni
    alert('Impostazioni salvate!');
  }

  changePassword(): void {
    // Placeholder: cambio password
    alert('Funzionalità in arrivo');
  }
}
