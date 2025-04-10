import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerPackagesComponent } from './player-packages.component';

describe('PlayerPackagesComponent', () => {
  let component: PlayerPackagesComponent;
  let fixture: ComponentFixture<PlayerPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerPackagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
