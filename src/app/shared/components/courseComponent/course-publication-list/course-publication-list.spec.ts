import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePublicationList } from './course-publication-list';

describe('CoursePublicationList', () => {
  let component: CoursePublicationList;
  let fixture: ComponentFixture<CoursePublicationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursePublicationList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursePublicationList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
