import { Component, Input } from '@angular/core';
import { RatingCommentsResponse } from '../../../../core/models/rating_comments';
import { Avatar } from "../../avatar/avatar";
import { TimeAgoPipe } from '../../../pipes/time-ago-pipe';

@Component({
  selector: 'app-course-user-comment',
  imports: [Avatar, TimeAgoPipe],
  templateUrl: './course-user-comment.html',
  styleUrl: './course-user-comment.css'
})
export class CourseUserComment {

  @Input() comment!:RatingCommentsResponse;

}
