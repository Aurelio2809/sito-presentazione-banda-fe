import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-subtitle-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="subtitle-text-wrapper">
      <div class="label" *ngIf="tag">{{ tag }}</div>
      <p class="desc">{{ text }}</p>
    </div>
  `,
  styleUrl: './home-subtitle-text.css'
})
export class HomeSubtitleText {
  @Input() tag: string = '';
  @Input() text: string = '';
}
