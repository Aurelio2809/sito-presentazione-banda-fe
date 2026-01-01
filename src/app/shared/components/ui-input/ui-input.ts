import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-input',
  templateUrl: './ui-input.html',
  standalone: false,
  styleUrl: './ui-input.css',
})
export class UiInput {
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() placeholder = '';
  @Input() value: string | number | null = null;
  @Input() name = '';
}
