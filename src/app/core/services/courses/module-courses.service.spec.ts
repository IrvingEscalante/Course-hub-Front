import { TestBed } from '@angular/core/testing';

import { ModuleCoursesService } from './module-courses.service';

describe('ModuleCoursesService', () => {
  let service: ModuleCoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleCoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
