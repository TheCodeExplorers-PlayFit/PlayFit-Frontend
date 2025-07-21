import { TestBed } from '@angular/core/testing';

import { SessionDetailService } from './session-detail.service';

describe('SessionDetailService', () => {
  let service: SessionDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
