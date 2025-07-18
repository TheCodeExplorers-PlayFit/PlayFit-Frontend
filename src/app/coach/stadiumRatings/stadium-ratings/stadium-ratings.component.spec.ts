import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadiumRatingsComponent } from './stadium-ratings.component';

describe('StadiumRatingsComponent', () => {
  let component: StadiumRatingsComponent;
  let fixture: ComponentFixture<StadiumRatingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StadiumRatingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StadiumRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
