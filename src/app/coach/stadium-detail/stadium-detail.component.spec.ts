import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadiumDetailComponent } from './stadium-detail.component';

describe('StadiumDetailComponent', () => {
  let component: StadiumDetailComponent;
  let fixture: ComponentFixture<StadiumDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StadiumDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StadiumDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
