import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseModal } from './course-modal';

describe('CourseModal', () => {
  let component: CourseModal;
  let fixture: ComponentFixture<CourseModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
