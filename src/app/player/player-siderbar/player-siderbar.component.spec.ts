import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSiderbarComponent } from './player-siderbar.component';

describe('PlayerSiderbarComponent', () => {
  let component: PlayerSiderbarComponent;
  let fixture: ComponentFixture<PlayerSiderbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerSiderbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerSiderbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
