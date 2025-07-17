import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionDetailsPopupComponent } from './session-details-popup.component';

describe('SessionDetailsPopupComponent', () => {
  let component: SessionDetailsPopupComponent;
  let fixture: ComponentFixture<SessionDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionDetailsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
