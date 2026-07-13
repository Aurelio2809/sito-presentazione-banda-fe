import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFeedbackService } from './ui-feedback.service';

@Component({
  selector: 'app-ui-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-feedback.html',
  styleUrls: ['./ui-feedback.css'],
})
export class UiFeedback {
  constructor(public feedback: UiFeedbackService) {}

  @HostListener('document:keydown', ['$event'])
  closeOnEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.feedback.confirmState()) this.feedback.closeConfirm(false);
  }
}
