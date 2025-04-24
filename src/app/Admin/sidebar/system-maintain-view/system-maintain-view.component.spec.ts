import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemMaintainViewComponent } from './system-maintain-view.component';

describe('SystemMaintainViewComponent', () => {
  let component: SystemMaintainViewComponent;
  let fixture: ComponentFixture<SystemMaintainViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemMaintainViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemMaintainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
