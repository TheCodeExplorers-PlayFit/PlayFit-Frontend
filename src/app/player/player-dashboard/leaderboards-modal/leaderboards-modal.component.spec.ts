import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardsModalComponent } from './leaderboards-modal.component';

describe('LeaderboardsModalComponent', () => {
  let component: LeaderboardsModalComponent;
  let fixture: ComponentFixture<LeaderboardsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderboardsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderboardsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
