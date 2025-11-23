import { Component, Input } from '@angular/core';
import { CourseModule } from '../course-module/course-module';
import { ModuleCourseResponse } from '../../../../core/models/detail_course.model';

@Component({
  selector: 'app-course-module-list',
  imports: [CourseModule],
  templateUrl: './course-module-list.html',
  styleUrl: './course-module-list.css'
})
export class CourseModuleList {

  @Input() moduleCourse:ModuleCourseResponse[] = []

}
