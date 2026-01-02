import { Component } from '@angular/core';
import { SOCIAL_LINKS, SOCIAL_URLS, SocialLink } from '../../../../shared/constants/social-links';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.css'],
  standalone: false,
})
export class Contacts {
  readonly SOCIAL_URLS = SOCIAL_URLS;      // utile se ti serve puntuale
  readonly socialLinks: SocialLink[] = SOCIAL_LINKS;
}
