import { TestBed } from '@angular/core/testing';
import { UiFeedbackService } from './ui-feedback.service';

describe('UiFeedbackService', () => {
  let service: UiFeedbackService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiFeedbackService);
  });

  afterEach(() => vi.useRealTimers());

  it('resolves confirmations and clears their state', async () => {
    const result = service.confirm({ title: 'Elimina', message: 'Sei sicuro?', danger: true });
    expect(service.confirmState()?.confirmText).toBe('Conferma');
    expect(service.confirmState()?.danger).toBe(true);

    service.closeConfirm(true);

    await expect(result).resolves.toBe(true);
    expect(service.confirmState()).toBeNull();
  });

  it('automatically dismisses regular toasts after four seconds', () => {
    service.toast('Salvato', 'success');
    expect(service.toasts()).toHaveLength(1);

    vi.advanceTimersByTime(4000);

    expect(service.toasts()).toHaveLength(0);
  });
});
