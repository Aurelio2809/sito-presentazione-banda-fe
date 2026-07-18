import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MessageService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('forwards a contact request to the public endpoint', () => {
    const payload = {
      senderName: 'Mario Rossi',
      senderEmail: 'mario@example.it',
      subject: 'Informazioni',
      content: 'Buongiorno',
    };

    service.send(payload).subscribe((response) => expect(response.status).toBe('sent'));

    const request = http.expectOne('/api/messages');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    expect(request.request.withCredentials).toBe(false);
    request.flush({ status: 'sent' });
  });
});
