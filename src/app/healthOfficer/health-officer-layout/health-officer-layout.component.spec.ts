import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthOfficerLayoutComponent } from './health-officer-layout.component';

describe('HealthOfficerLayoutComponent', () => {
  let component: HealthOfficerLayoutComponent;
  let fixture: ComponentFixture<HealthOfficerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthOfficerLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthOfficerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
