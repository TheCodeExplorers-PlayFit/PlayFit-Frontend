import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyAdviceComponent } from './safety-advice.component';

describe('SafetyAdviceComponent', () => {
  let component: SafetyAdviceComponent;
  let fixture: ComponentFixture<SafetyAdviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafetyAdviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SafetyAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
