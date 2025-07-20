import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachAnnouncementComponent } from './coach-announcement.component';

describe('CoachAnnouncementComponent', () => {
  let component: CoachAnnouncementComponent;
  let fixture: ComponentFixture<CoachAnnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachAnnouncementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
