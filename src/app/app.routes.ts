import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Login dashboard - sempre accessibile
  {
    path: 'dashboard/login',
    loadComponent: () =>
      import('./features/dashboard/pages/login/login').then(m => m.Login),
  },
  // Dashboard protetta dal guard
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard-module').then(m => m.DashboardModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/main/main-module').then(m => m.MainModule),
  },
  { path: '**', redirectTo: '' },
];
