import { Component } from '@angular/core';

export type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
};

@Component({
  selector: 'app-messages',
  templateUrl: './messages.html',
  styleUrls: ['./messages.css'],
  standalone: false,
})
export class Messages {
  messages: Message[] = [
    { id: 1, name: 'Mario Rossi', email: 'mario.rossi@email.it', subject: 'Informazioni iscrizione', message: 'Buongiorno, vorrei avere informazioni sulla scuola di musica per mio figlio di 10 anni. Quali strumenti sono disponibili? Grazie.', date: '2024-12-20', isRead: false },
    { id: 2, name: 'Laura Bianchi', email: 'laura.b@email.it', subject: 'Disponibilità per evento', message: 'Salve, stiamo organizzando un evento privato e vorremmo sapere se la banda è disponibile per una esibizione il 15 marzo.', date: '2024-12-18', isRead: false },
    { id: 3, name: 'Giuseppe Verdi', email: 'g.verdi@email.it', subject: 'Complimenti per il concerto', message: 'Volevo complimentarmi per il bellissimo concerto di sabato scorso. È stato emozionante!', date: '2024-12-15', isRead: true },
    { id: 4, name: 'Anna Neri', email: 'anna.neri@email.it', subject: 'Richiesta info prove', message: 'Suono il clarinetto da qualche anno e vorrei unirmi alla banda. Come posso fare? Quando sono le prove?', date: '2024-12-10', isRead: true },
    { id: 5, name: 'Paolo Gialli', email: 'paolo.g@email.it', subject: 'Collaborazione', message: 'Rappresento un\'altra associazione musicale e vorremmo proporre una collaborazione per un evento congiunto.', date: '2024-12-05', isRead: true },
  ];

  selectedMessage: Message | null = null;
  filterUnread = false;

  get filteredMessages(): Message[] {
    return this.filterUnread ? this.messages.filter(m => !m.isRead) : this.messages;
  }

  get unreadCount(): number {
    return this.messages.filter(m => !m.isRead).length;
  }

  selectMessage(message: Message): void {
    this.selectedMessage = message;
    if (!message.isRead) {
      message.isRead = true;
    }
  }

  closeMessage(): void {
    this.selectedMessage = null;
  }

  deleteMessage(message: Message): void {
    if (confirm('Eliminare questo messaggio?')) {
      this.messages = this.messages.filter(m => m.id !== message.id);
      if (this.selectedMessage?.id === message.id) {
        this.selectedMessage = null;
      }
    }
  }

  toggleRead(message: Message, event: Event): void {
    event.stopPropagation();
    message.isRead = !message.isRead;
  }

  markAllRead(): void {
    this.messages.forEach(m => m.isRead = true);
  }
}
