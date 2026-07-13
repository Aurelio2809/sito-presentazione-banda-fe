import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  /** true per azioni distruttive: il bottone di conferma diventa rosso */
  danger?: boolean;
}

interface ConfirmState extends Required<Omit<ConfirmOptions, 'danger'>> {
  danger: boolean;
  resolve: (ok: boolean) => void;
}

export interface Toast {
  id: number;
  text: string;
  kind: 'success' | 'error' | 'info';
}

/**
 * Sostituisce confirm()/alert() nativi del browser con UI coerente col tema.
 * confirm() è promise-based: `if (!(await feedback.confirm({...}))) return;`
 * I toast si auto-dismettono; gli errori restano un po' più a lungo.
 */
@Injectable({ providedIn: 'root' })
export class UiFeedbackService {
  readonly confirmState = signal<ConfirmState | null>(null);
  readonly toasts = signal<Toast[]>([]);
  private nextId = 1;

  confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmState.set({
        confirmText: 'Conferma',
        cancelText: 'Annulla',
        danger: false,
        ...options,
        resolve,
      });
    });
  }

  closeConfirm(ok: boolean): void {
    const state = this.confirmState();
    if (state) {
      this.confirmState.set(null);
      state.resolve(ok);
    }
  }

  toast(text: string, kind: Toast['kind'] = 'info'): void {
    const toast: Toast = { id: this.nextId++, text, kind };
    this.toasts.update((list) => [...list, toast]);
    setTimeout(() => this.dismiss(toast.id), kind === 'error' ? 6000 : 4000);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
