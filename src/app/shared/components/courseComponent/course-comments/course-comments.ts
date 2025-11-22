import { Component } from '@angular/core';
import { CourseListComments } from "../course-list-comments/course-list-comments";

@Component({
  selector: 'app-course-comments',
  imports: [CourseListComments],
  templateUrl: './course-comments.html',
  styleUrl: './course-comments.css'
})
export class CourseComments {

}
