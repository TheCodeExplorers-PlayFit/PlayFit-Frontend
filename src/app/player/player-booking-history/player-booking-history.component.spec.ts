import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBookingHistoryComponent } from './player-booking-history.component';

describe('PlayerBookingHistoryComponent', () => {
  let component: PlayerBookingHistoryComponent;
  let fixture: ComponentFixture<PlayerBookingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerBookingHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerBookingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
