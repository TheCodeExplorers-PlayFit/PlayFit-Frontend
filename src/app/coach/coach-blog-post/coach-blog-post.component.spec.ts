import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachBlogPostComponent } from './coach-blog-post.component';

describe('CoachBlogPostComponent', () => {
  let component: CoachBlogPostComponent;
  let fixture: ComponentFixture<CoachBlogPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachBlogPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachBlogPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
