import { TestBed } from '@angular/core/testing';

import { CoachAchievementService } from './coach-achievement.service';

describe('CoachAchievementService', () => {
  let service: CoachAchievementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoachAchievementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
