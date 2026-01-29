import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../../core/services';
import { MessageResponse } from '../../../../core/models';

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

  constructor(private messageService: MessageService) {}

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

  deleteMessage(message: MessageResponse): void {
    if (confirm('Eliminare questo messaggio?')) {
      this.messageService.delete(message.id).subscribe({
        next: () => {
          this.messages = this.messages.filter(m => m.id !== message.id);
          if (this.selectedMessage?.id === message.id) {
            this.selectedMessage = null;
          }
        },
        error: (err) => {
          alert('Errore nell\'eliminazione del messaggio');
          console.error(err);
        }
      });
    }
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
      },
      error: (err) => console.error('Errore', err)
    });
  }

  onFilterChange(): void {
    this.loadMessages();
  }
}
