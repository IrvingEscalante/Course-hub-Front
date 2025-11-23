import { TestBed } from '@angular/core/testing';

import { DetailCourses } from './detail-courses';

describe('DetailCourses', () => {
  let service: DetailCourses;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailCourses);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
