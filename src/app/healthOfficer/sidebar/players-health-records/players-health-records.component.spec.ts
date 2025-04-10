import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersHealthRecordsComponent } from './players-health-records.component';

describe('PlayersHealthRecordsComponent', () => {
  let component: PlayersHealthRecordsComponent;
  let fixture: ComponentFixture<PlayersHealthRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersHealthRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayersHealthRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
