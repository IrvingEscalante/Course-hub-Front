import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RatingCommentsResponse } from '../../../../core/models/rating_comments';
import { Avatar } from "../../avatar/avatar";
import { TimeAgoPipe } from '../../../pipes/time-ago-pipe';
import { RouterLink, RouterModule } from "@angular/router";
import { UserOut } from '../../../../core/models/user.model';

@Component({
  selector: 'app-course-user-comment',
  imports: [Avatar, TimeAgoPipe, RouterModule],
  templateUrl: './course-user-comment.html',
  styleUrl: './course-user-comment.css'
})
export class CourseUserComment {

  @Input() comment!:RatingCommentsResponse;
  @Input() userLogged:UserOut | null = null;
  @Output() onDeleteComment: EventEmitter<number> = new EventEmitter<number>();
  @Output() onEditComment: EventEmitter<RatingCommentsResponse> = new EventEmitter<RatingCommentsResponse>();

  deleteComment(){
    this.onDeleteComment.emit(this.comment.id_ratings_comments);
  }

  editComment(){
    this.onEditComment.emit(this.comment);
  }

}
