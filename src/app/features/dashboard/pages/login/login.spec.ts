import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../../core/services';
import { Login } from './login';

describe('Login', () => {
  const login = vi.fn();
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { login } },
      ],
    }).compileComponents();
    login.mockReset();
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });

  it('does not call the API when credentials are missing', () => {
    const component = TestBed.createComponent(Login).componentInstance;

    component.onSubmit(new Event('submit'));

    expect(component.error).toBe('Inserisci username e password');
    expect(login).not.toHaveBeenCalled();
  });

  it('navigates to the dashboard after a successful login', () => {
    login.mockReturnValue(of({ id: 1 }));
    const component = TestBed.createComponent(Login).componentInstance;
    component.username = 'admin';
    component.password = 'secret';

    component.onSubmit(new Event('submit'));

    expect(login).toHaveBeenCalledWith('admin', 'secret');
    expect(navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('shows a specific error for invalid credentials', () => {
    login.mockReturnValue(throwError(() => ({ status: 401 })));
    const component = TestBed.createComponent(Login).componentInstance;
    component.username = 'admin';
    component.password = 'wrong';

    component.onSubmit(new Event('submit'));

    expect(component.loading).toBe(false);
    expect(component.error).toBe('Credenziali non valide');
  });
});
