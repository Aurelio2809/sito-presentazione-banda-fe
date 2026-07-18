import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-section',
  standalone: true,
  imports: [],
  template: `
    <section class="home-section-wrapper" [attr.data-key]="key">
      <div class="home-section-inner">
        <div class="home-section-content">
          <ng-content></ng-content>
        </div>
      </div>
    </section>
  `,
  styleUrl: './home-section.css'
})
export class HomeSection {
  @Input() key: string = '';
}
