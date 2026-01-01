import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  templateUrl: './ui-button.html',
  standalone: false,
  styleUrl: './ui-button.css',
})
export class UiButton {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  @Input() disabled = false;

  get classes(): string {
    const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition';
    const variants: Record<string, string> = {
      primary: 'bg-black text-white hover:opacity-90 disabled:opacity-50',
      secondary: 'bg-white text-black border border-black hover:bg-gray-50 disabled:opacity-50',
      ghost: 'bg-transparent text-black hover:bg-gray-100 disabled:opacity-50',
    };
    return `${base} ${variants[this.variant]}`;
  }
}
