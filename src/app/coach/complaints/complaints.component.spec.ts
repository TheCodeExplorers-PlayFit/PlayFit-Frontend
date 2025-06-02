import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachComplaintsComponent } from './complaints.component';

describe('CoachComplaintsComponent', () => {
  let component: CoachComplaintsComponent;
  let fixture: ComponentFixture<CoachComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
