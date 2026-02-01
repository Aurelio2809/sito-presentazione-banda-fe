import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.html',
  styleUrls: ['./loading-spinner.css'],
  standalone: false,
})
export class LoadingSpinner {
  @Input() message?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() overlay = false;
}
