import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerHealthtipsComponent } from './player-healthtips.component';

describe('PlayerHealthtipsComponent', () => {
  let component: PlayerHealthtipsComponent;
  let fixture: ComponentFixture<PlayerHealthtipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerHealthtipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerHealthtipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
