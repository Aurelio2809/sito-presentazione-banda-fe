import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { AuthService } from '../services';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const checkAuth = vi.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { checkAuth } },
      ],
    });
    checkAuth.mockReset();
  });

  it('allows authenticated users', async () => {
    checkAuth.mockReturnValue(of({ id: 1, username: 'admin' }));

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(AuthGuard({} as never, {} as never) as Observable<boolean | UrlTree>),
    );

    expect(result).toBe(true);
  });

  it.each([
    ['an empty session', of(null)],
    ['an API error', throwError(() => new Error('offline'))],
  ])('redirects to login for %s', async (_case, response) => {
    checkAuth.mockReturnValue(response);

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(AuthGuard({} as never, {} as never) as Observable<boolean | UrlTree>),
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/dashboard/login');
  });
});
