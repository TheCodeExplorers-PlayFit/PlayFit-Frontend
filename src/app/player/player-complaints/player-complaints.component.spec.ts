import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerComplaintsComponent } from './player-complaints.component';

describe('PlayerComplaintsComponent', () => {
  let component: PlayerComplaintsComponent;
  let fixture: ComponentFixture<PlayerComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
