import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-title',
  standalone: true,
  imports: [],
  template: `
    <h2 class="home-title title--ornament" [class.desktop-left]="align === 'left'">
      {{ text }}
    </h2>
  `,
  styleUrl: './home-title.css'
})
export class HomeTitle {
  @Input() text: string = '';
  @Input() align: 'left' | 'center' = 'left';
}
