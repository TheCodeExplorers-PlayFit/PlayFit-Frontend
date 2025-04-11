import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyAdviceCreateComponent } from './safety-advice-create.component';

describe('SafetyAdviceCreateComponent', () => {
  let component: SafetyAdviceCreateComponent;
  let fixture: ComponentFixture<SafetyAdviceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafetyAdviceCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SafetyAdviceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
