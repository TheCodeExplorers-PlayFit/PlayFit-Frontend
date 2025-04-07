import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateRequestsComponent } from './private-requests.component';

describe('PrivateRequestsComponent', () => {
  let component: PrivateRequestsComponent;
  let fixture: ComponentFixture<PrivateRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivateRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
