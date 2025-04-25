import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsModalComponent } from './locations-modal.component';

describe('LocationsModalComponent', () => {
  let component: LocationsModalComponent;
  let fixture: ComponentFixture<LocationsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
