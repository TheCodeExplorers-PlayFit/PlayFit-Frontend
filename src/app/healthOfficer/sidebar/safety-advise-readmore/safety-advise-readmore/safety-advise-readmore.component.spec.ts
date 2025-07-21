import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyAdviseReadmoreComponent } from './safety-advise-readmore.component';

describe('SafetyAdviseReadmoreComponent', () => {
  let component: SafetyAdviseReadmoreComponent;
  let fixture: ComponentFixture<SafetyAdviseReadmoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafetyAdviseReadmoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SafetyAdviseReadmoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
