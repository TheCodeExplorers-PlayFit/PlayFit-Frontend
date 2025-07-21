import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerPrivateSessionsComponent } from './player-private-sessions.component';

describe('PlayerPrivateSessionsComponent', () => {
  let component: PlayerPrivateSessionsComponent;
  let fixture: ComponentFixture<PlayerPrivateSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerPrivateSessionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerPrivateSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
