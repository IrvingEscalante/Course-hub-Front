import { Component } from '@angular/core';
import { CourseModuleList } from '../../../shared/components/courseComponent/course-module-list/course-module-list';

@Component({
  selector: 'app-detail-course',
  imports: [CourseModuleList],
  templateUrl: './detail-course.html',
  styleUrl: './detail-course.css'
})
export class DetailCourse {
   ratings = [
    { stars: 5, percent: 50 },
    { stars: 4, percent: 30 },
    { stars: 3, percent: 10 },
    { stars: 2, percent: 5 },
    { stars: 1, percent: 5 }
  ];
}
