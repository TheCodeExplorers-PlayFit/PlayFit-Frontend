import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordInjuriesComponent } from './record-injuries.component';

describe('RecordInjuriesComponent', () => {
  let component: RecordInjuriesComponent;
  let fixture: ComponentFixture<RecordInjuriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordInjuriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordInjuriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
