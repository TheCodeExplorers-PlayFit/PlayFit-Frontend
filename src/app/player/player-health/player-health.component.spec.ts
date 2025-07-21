import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerHealthComponent } from './player-health.component';

describe('PlayerHealthComponent', () => {
  let component: PlayerHealthComponent;
  let fixture: ComponentFixture<PlayerHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerHealthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
