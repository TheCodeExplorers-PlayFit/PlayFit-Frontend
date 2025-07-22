import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthTipsDetailsComponent } from './health-tips-details.component';

describe('HealthTipsDetailsComponent', () => {
  let component: HealthTipsDetailsComponent;
  let fixture: ComponentFixture<HealthTipsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthTipsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthTipsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
