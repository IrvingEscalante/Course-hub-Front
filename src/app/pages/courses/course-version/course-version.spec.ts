import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseVersionPage } from './course-version';

describe('CourseVersionPage', () => {
  let component: CourseVersionPage;
  let fixture: ComponentFixture<CourseVersionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseVersionPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseVersionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
