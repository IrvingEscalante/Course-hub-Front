import { Component } from '@angular/core';
import { CourseList } from "../../shared/components/courseComponent/course-list/course-list";
import { CoursesService } from '../../core/services/courses/courses.service';
import { Course } from '../../core/models/course.model';
@Component({
  selector: 'app-dashboard',
  imports: [CourseList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  filters = ['Todos', 'Populares', 'Nuevos', 'Tendencias'];
  selectedFilter = 'Todos';
  courses: Course[] = [];
  
  selectFilter(filter: string) {
    this.selectedFilter = filter;
  }

  constructor(private courseService: CoursesService){}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

}
