import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAnnouncementsComponent } from './player-announcements.component';

describe('PlayerAnnouncementsComponent', () => {
  let component: PlayerAnnouncementsComponent;
  let fixture: ComponentFixture<PlayerAnnouncementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerAnnouncementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerAnnouncementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
