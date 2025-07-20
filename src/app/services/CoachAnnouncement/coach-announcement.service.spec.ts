import { TestBed } from '@angular/core/testing';

import { CoachAnnouncementService } from './coach-announcement.service';

describe('CoachAnnouncementService', () => {
  let service: CoachAnnouncementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoachAnnouncementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
