import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialNoticesComponent } from './special-notices.component';

describe('SpecialNoticesComponent', () => {
  let component: SpecialNoticesComponent;
  let fixture: ComponentFixture<SpecialNoticesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialNoticesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialNoticesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
