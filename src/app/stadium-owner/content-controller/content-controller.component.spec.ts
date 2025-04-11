import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentControllerComponent } from './content-controller.component';

describe('ContentControllerComponent', () => {
  let component: ContentControllerComponent;
  let fixture: ComponentFixture<ContentControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentControllerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
