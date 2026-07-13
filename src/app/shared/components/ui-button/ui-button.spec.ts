import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiButton } from './ui-button';

describe('UiButton', () => {
  let component: UiButton;
  let fixture: ComponentFixture<UiButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiButton]
    }).compileComponents();

    fixture = TestBed.createComponent(UiButton);
    component = fixture.componentInstance;
  });

  it('renders its variant, content and disabled state', () => {
    component.variant = 'secondary';
    component.disabled = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.className).toContain('bg-white');
  });
});
