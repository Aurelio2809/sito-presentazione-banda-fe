import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../../core/services';
import { MessageResponse } from '../../../../core/models';
import { UiFeedbackService } from '../../components/ui-feedback/ui-feedback.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.html',
  styleUrls: ['./messages.css'],
  standalone: false,
})
export class Messages implements OnInit {
  messages: MessageResponse[] = [];
  selectedMessage: MessageResponse | null = null;
  filterUnread = false;
  loading = false;
  error: string | null = null;

  constructor(
    private messageService: MessageService,
    private feedback: UiFeedbackService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;
    this.error = null;
    
    const filter = this.filterUnread ? 'unread' : undefined;
    this.messageService.getAll(0, 100, filter).subscribe({
      next: (page) => {
        this.messages = page.content;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento dei messaggi';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get filteredMessages(): MessageResponse[] {
    return this.filterUnread ? this.messages.filter(m => !m.read) : this.messages;
  }

  get unreadCount(): number {
    return this.messages.filter(m => !m.read).length;
  }

  selectMessage(message: MessageResponse): void {
    this.selectedMessage = message;
    if (!message.read) {
      this.messageService.markAsRead(message.id).subscribe({
        next: (updated) => {
          const index = this.messages.findIndex(m => m.id === message.id);
          if (index >= 0) {
            this.messages[index] = updated;
          }
          this.selectedMessage = updated;
        },
        error: (err) => console.error('Errore nel segnare come letto', err)
      });
    }
  }

  closeMessage(): void {
    this.selectedMessage = null;
  }

  async deleteMessage(message: MessageResponse): Promise<void> {
    const confirmed = await this.feedback.confirm({
      title: 'Eliminare il messaggio?',
      message: 'Questa azione è definitiva e il messaggio non potrà essere recuperato.',
      confirmText: 'Elimina',
      danger: true,
    });
    if (!confirmed) return;

    this.messageService.delete(message.id).subscribe({
      next: () => {
        this.messages = this.messages.filter(m => m.id !== message.id);
        if (this.selectedMessage?.id === message.id) {
          this.selectedMessage = null;
        }
        this.feedback.toast('Messaggio eliminato', 'success');
      },
      error: (err) => {
        this.feedback.toast('Errore nell\'eliminazione del messaggio', 'error');
        console.error(err);
      }
    });
  }

  toggleRead(message: MessageResponse, event: Event): void {
    event.stopPropagation();
    if (!message.read) {
      this.messageService.markAsRead(message.id).subscribe({
        next: (updated) => {
          const index = this.messages.findIndex(m => m.id === message.id);
          if (index >= 0) {
            this.messages[index] = updated;
          }
        },
        error: (err) => console.error('Errore', err)
      });
    }
  }

  markAllRead(): void {
    this.messageService.markAllAsRead().subscribe({
      next: () => {
        this.messages.forEach(m => m.read = true);
        this.feedback.toast('Tutti i messaggi sono stati segnati come letti', 'success');
      },
      error: (err) => {
        this.feedback.toast('Impossibile aggiornare i messaggi', 'error');
        console.error('Errore', err);
      }
    });
  }

  onFilterChange(): void {
    this.loadMessages();
  }
}
