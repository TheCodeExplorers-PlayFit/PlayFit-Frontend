import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachAchievementsComponent } from './coach-achievements.component';

describe('CoachAchievementsComponent', () => {
  let component: CoachAchievementsComponent;
  let fixture: ComponentFixture<CoachAchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachAchievementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
