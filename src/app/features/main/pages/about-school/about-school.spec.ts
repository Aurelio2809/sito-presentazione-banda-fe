import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSchool } from './about-school';

describe('AboutSchool', () => {
  let component: AboutSchool;
  let fixture: ComponentFixture<AboutSchool>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutSchool]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutSchool);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
