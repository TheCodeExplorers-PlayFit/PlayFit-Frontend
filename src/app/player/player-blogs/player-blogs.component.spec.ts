import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBlogsComponent } from './player-blogs.component';

describe('PlayerBlogsComponent', () => {
  let component: PlayerBlogsComponent;
  let fixture: ComponentFixture<PlayerBlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerBlogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
