import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadiumTimetableComponent } from './stadium-timetable.component';

describe('StadiumTimetableComponent', () => {
  let component: StadiumTimetableComponent;
  let fixture: ComponentFixture<StadiumTimetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StadiumTimetableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StadiumTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
