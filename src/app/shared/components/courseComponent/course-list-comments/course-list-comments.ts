import { Component } from '@angular/core';
import { CourseUserComment } from "../course-user-comment/course-user-comment";

@Component({
  selector: 'app-course-list-comments',
  imports: [CourseUserComment],
  templateUrl: './course-list-comments.html',
  styleUrl: './course-list-comments.css'
})
export class CourseListComments {

}
