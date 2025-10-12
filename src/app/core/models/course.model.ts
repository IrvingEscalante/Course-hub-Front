import { RatingCommentsCourseResponse } from "./ratingComments.model";
import { UserOut } from "./user.model";

export interface Course {
  id_course: number;
  name_course: string;
  description_course: string;
  image: string;
  is_forked: boolean;
  date_created: Date;
  date_updated: Date | null;
  id_user: number;
  id_author_user: number;
  avg_rating:number;
  status_course: boolean;
  user: UserOut;     
  author: UserOut;  
}
