import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiInput } from './ui-input';
import { SharedModule } from '../../shared-module';

describe('UiInput', () => {
  let component: UiInput;
  let fixture: ComponentFixture<UiInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UiInput);
    component = fixture.componentInstance;
  });

  it('forwards label, type, name, placeholder and value to the input', async () => {
    component.label = 'Email';
    component.type = 'email';
    component.name = 'email';
    component.placeholder = 'nome@example.it';
    component.value = 'aurelio@example.it';
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    const input = element.querySelector('input') as HTMLInputElement;
    expect(element.querySelector('span')?.textContent).toContain('Email');
    expect(input.type).toBe('email');
    expect(input.name).toBe('email');
    expect(input.placeholder).toBe('nome@example.it');
    expect(input.value).toBe('aurelio@example.it');
  });
});
