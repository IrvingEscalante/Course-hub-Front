import { Component, Input} from '@angular/core';
import { CourseCard } from "../course-card/course-card";
import { Course } from '../../../../core/models/course.model';


@Component({
  selector: 'app-course-list',
  imports: [CourseCard],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})
export class CourseList {
  @Input() title: string = "Cursos destacados";
  @Input() courseList: Course[] = [];
  @Input() username: string = '';
  @Input() isFavorites: boolean = false;
}
