import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInFormMedicalOfficerComponent } from './sign-in-form-medical-officer.component';

describe('SignInFormMedicalOfficerComponent', () => {
  let component: SignInFormMedicalOfficerComponent;
  let fixture: ComponentFixture<SignInFormMedicalOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInFormMedicalOfficerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInFormMedicalOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
