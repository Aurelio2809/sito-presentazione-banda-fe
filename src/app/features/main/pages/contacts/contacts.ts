import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SOCIAL_LINKS, SocialLink } from '../../../../shared/constants/social-links';
import {
  BAND_CONTACT,
  BAND_ADDRESS_FULL,
  MAPS_URL,
  MAPS_EMBED_URL,
} from '../../../../shared/constants/sede-maps-link';
import { MessageService } from '../../../../core/services';
import { MessageRequest } from '../../../../core/models';
import { TranslateService } from '@ngx-translate/core';

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.css'],
  standalone: false,
})
export class Contacts {
  readonly socialLinks: SocialLink[] = SOCIAL_LINKS;

  readonly BAND_CONTACT = BAND_CONTACT;
  readonly BAND_ADDRESS_FULL = BAND_ADDRESS_FULL;
  readonly MAPS_URL = MAPS_URL;

  readonly mapEmbedSafeUrl: SafeResourceUrl;

  form: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  sending = false;
  success = false;
  error: string | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    this.mapEmbedSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(MAPS_EMBED_URL);
  }

  onSubmit(ev: Event): void {
    ev.preventDefault();
    
    if (!this.form.name || !this.form.email || !this.form.message) {
      this.error = this.translate.instant('CONTACTS.ERR_REQUIRED');
      return;
    }

    this.sending = true;
    this.error = null;
    this.success = false;

    const request: MessageRequest = {
      senderName: this.form.name,
      senderEmail: this.form.email,
      subject: this.form.subject || this.translate.instant('CONTACTS.DEFAULT_SUBJECT'),
      content: this.form.message
    };

    this.messageService.send(request).subscribe({
      next: () => {
        this.success = true;
        this.sending = false;
        this.form = { name: '', email: '', subject: '', message: '' };
        setTimeout(() => this.success = false, 5000);
      },
      error: (err) => {
        this.error = this.translate.instant('CONTACTS.ERR_SEND');
        this.sending = false;
        console.error(err);
      }
    });
  }
}
