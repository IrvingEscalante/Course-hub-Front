import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseComments } from './course-comments';

describe('CourseComments', () => {
  let component: CourseComments;
  let fixture: ComponentFixture<CourseComments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseComments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseComments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
