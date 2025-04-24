import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemMaintainCreateComponent } from './system-maintain-create.component';

describe('SystemMaintainCreateComponent', () => {
  let component: SystemMaintainCreateComponent;
  let fixture: ComponentFixture<SystemMaintainCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemMaintainCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemMaintainCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
