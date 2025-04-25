import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerTimetableComponent } from './player-timetable.component';

describe('PlayerTimetableComponent', () => {
  let component: PlayerTimetableComponent;
  let fixture: ComponentFixture<PlayerTimetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerTimetableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
