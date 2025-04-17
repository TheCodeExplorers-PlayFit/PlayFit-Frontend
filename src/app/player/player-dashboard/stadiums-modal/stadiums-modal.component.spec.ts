import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadiumsModalComponent } from './stadiums-modal.component';

describe('StadiumsModalComponent', () => {
  let component: StadiumsModalComponent;
  let fixture: ComponentFixture<StadiumsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StadiumsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StadiumsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
