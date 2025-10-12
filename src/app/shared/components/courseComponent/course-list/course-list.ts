import { Component, input, Input } from '@angular/core';
import { CourseCard } from "../course-card/course-card";
import { Course } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-list',
  imports: [CourseCard],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})
export class CourseList {
  @Input() title:string = "Cursos destacados"
  @Input() userId?: number;
  @Input() courseList:Course[] = [];


}
