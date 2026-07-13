import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.html',
  styleUrls: ['./empty-state.css'],
  standalone: false,
})
export class EmptyState {
  @Input({ required: true }) title = '';
  @Input() text = '';
  @Input() actionLabel = '';
  @Input() actionLink = '';
  @Input() icon: 'gallery' | 'calendar' | 'announcement' = 'calendar';
  @Input() tone: 'neutral' | 'error' = 'neutral';
  @Input() compact = false;
}
