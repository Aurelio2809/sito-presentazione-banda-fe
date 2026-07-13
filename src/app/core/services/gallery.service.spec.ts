import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GalleryService } from './gallery.service';

describe('GalleryService', () => {
  let service: GalleryService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(GalleryService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the public gallery with paging and sorting', () => {
    service.getPublicPhotos(2, 6, 'date').subscribe();

    const request = http.expectOne(
      (candidate) => candidate.url === '/api/gallery/public',
    );
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('size')).toBe('6');
    expect(request.request.params.get('orderBy')).toBe('date');
    expect(request.request.withCredentials).toBe(false);
    request.flush({ content: [], totalElements: 0 });
  });

  it('uses credentials for protected gallery operations', () => {
    service.delete(42).subscribe();

    const request = http.expectOne('/api/gallery/42');
    expect(request.request.method).toBe('DELETE');
    expect(request.request.withCredentials).toBe(true);
    request.flush(null);
  });
});
