import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadiumListComponent } from './stadium-list.component';

describe('StadiumListComponent', () => {
  let component: StadiumListComponent;
  let fixture: ComponentFixture<StadiumListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StadiumListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StadiumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
