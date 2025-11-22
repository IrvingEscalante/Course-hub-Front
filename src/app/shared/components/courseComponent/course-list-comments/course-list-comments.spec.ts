import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseListComments } from './course-list-comments';

describe('CourseListComments', () => {
  let component: CourseListComments;
  let fixture: ComponentFixture<CourseListComments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseListComments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseListComments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
