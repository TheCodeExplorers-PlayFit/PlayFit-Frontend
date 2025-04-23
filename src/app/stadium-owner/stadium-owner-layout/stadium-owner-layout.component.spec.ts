import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadiumOwnerLayoutComponent } from './stadium-owner-layout.component';

describe('StadiumOwnerLayoutComponent', () => {
  let component: StadiumOwnerLayoutComponent;
  let fixture: ComponentFixture<StadiumOwnerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StadiumOwnerLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StadiumOwnerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
