import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SOCIAL_LINKS, SocialLink } from '../../../../shared/constants/social-links';
import {
  BAND_CONTACT,
  BAND_ADDRESS_FULL,
  MAPS_URL,
  MAPS_EMBED_URL,
} from '../../../../shared/constants/sede-maps-link';

type ContactForm = {
  from: string;
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
    from: '',
    subject: '',
    message: '',
  };

  constructor(private sanitizer: DomSanitizer) {
    this.mapEmbedSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(MAPS_EMBED_URL);
  }

  onSubmit(ev: Event): void {
    ev.preventDefault();
    alert('Messaggio pronto! (placeholder) Collegami a un backend per inviarlo davvero.');
    this.form = { from: '', subject: '', message: '' };
  }
}
