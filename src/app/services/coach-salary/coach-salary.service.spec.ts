import { TestBed } from '@angular/core/testing';

import { CoachSalaryService } from './coach-salary.service';

describe('CoachSalaryService', () => {
  let service: CoachSalaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoachSalaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
