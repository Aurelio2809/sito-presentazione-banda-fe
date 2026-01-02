import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutToday } from './about-today';

describe('AboutToday', () => {
  let component: AboutToday;
  let fixture: ComponentFixture<AboutToday>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutToday]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutToday);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
