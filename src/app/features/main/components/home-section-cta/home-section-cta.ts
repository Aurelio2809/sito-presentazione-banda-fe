import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-section-cta',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="actions">
      <a class="btn" [routerLink]="link" *ngIf="link; else extLink">{{ text }}</a>
      <ng-template #extLink>
        <a class="btn" [href]="href" target="_blank">{{ text }}</a>
      </ng-template>
    </div>
  `,
  styleUrl: './home-section-cta.css'
})
export class HomeSectionCta {
  @Input() text: string = '';
  @Input() link?: string; // App Internal
  @Input() href?: string; // External
}
