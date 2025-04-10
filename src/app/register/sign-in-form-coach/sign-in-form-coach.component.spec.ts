import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInFormCoachComponent } from './sign-in-form-coach.component';

describe('SignInFormCoachComponent', () => {
  let component: SignInFormCoachComponent;
  let fixture: ComponentFixture<SignInFormCoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInFormCoachComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInFormCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
