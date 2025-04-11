import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInFormCommonComponent } from './sign-in-form-common.component';

describe('SignInFormCommonComponent', () => {
  let component: SignInFormCommonComponent;
  let fixture: ComponentFixture<SignInFormCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInFormCommonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInFormCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
