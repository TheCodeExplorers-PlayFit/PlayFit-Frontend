import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInFromStadiumOwnerComponent } from './sign-in-from-stadium-owner.component';

describe('SignInFromStadiumOwnerComponent', () => {
  let component: SignInFromStadiumOwnerComponent;
  let fixture: ComponentFixture<SignInFromStadiumOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInFromStadiumOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInFromStadiumOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
