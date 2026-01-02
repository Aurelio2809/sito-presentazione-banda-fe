import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutHistory } from './about-history';

describe('AboutHistory', () => {
  let component: AboutHistory;
  let fixture: ComponentFixture<AboutHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
