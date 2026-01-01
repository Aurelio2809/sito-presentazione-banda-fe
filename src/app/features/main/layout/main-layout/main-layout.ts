import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  standalone: false,
  styleUrl: './main-layout.css',
})
export class MainLayout {
  currentYear = new Date().getFullYear();
}
