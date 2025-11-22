import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseUserComment } from './course-user-comment';

describe('CourseUserComment', () => {
  let component: CourseUserComment;
  let fixture: ComponentFixture<CourseUserComment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseUserComment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseUserComment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
