import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportsModalComponent } from './sports-modal.component';

describe('SportsModalComponent', () => {
  let component: SportsModalComponent;
  let fixture: ComponentFixture<SportsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
