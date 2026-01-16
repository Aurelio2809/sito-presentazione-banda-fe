import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-transparent-card',
  templateUrl: './transparent-card.html',
  styleUrls: ['./transparent-card.css'],
  standalone: false,
})
export class TransparentCard {
  @Input() className: string = '';
  @Input() ariaLabel: string = '';
}
