import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachPrivateSessionsComponent } from './coach-private-sessions.component';

describe('CoachPrivateSessionsComponent', () => {
  let component: CoachPrivateSessionsComponent;
  let fixture: ComponentFixture<CoachPrivateSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachPrivateSessionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachPrivateSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
