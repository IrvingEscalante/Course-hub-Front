import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePublication } from './course-publication';

describe('CoursePublication', () => {
  let component: CoursePublication;
  let fixture: ComponentFixture<CoursePublication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursePublication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursePublication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
