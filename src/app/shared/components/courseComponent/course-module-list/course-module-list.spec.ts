import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseModuleList } from './course-module-list';

describe('CourseModuleList', () => {
  let component: CourseModuleList;
  let fixture: ComponentFixture<CourseModuleList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseModuleList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseModuleList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
