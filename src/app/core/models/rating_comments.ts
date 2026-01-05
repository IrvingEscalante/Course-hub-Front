import { UserOut } from "./user.model";

export interface RatingCommentsCreate {
  id_course: number;
  comment_detail: string;
  rating: number;
}
/*

comment_detail
: 
"SIIII"
date_created
: 
"2025-11-24T21:56:52"
id_course
: 
45
id_ratings_comments
: 
3
rating
: 
5
status
: 
true
user_rating
: 
email
: 
"sianuquirojoseledonia@gmail.com"
lastname
: 
"Sianuqui"
name
: 
"Seledonia"
photo
: 
null
username
: 
"sele"
[[Prototype]]
: 
Object
*/
export interface RatingCommentsResponse {
  id_ratings_comments: number;
  id_course: number;
  comment_detail: string;
  rating: number;
  status: boolean;
  date_created: string;
  user_rating: UserOut;
}

export interface RatingCourseItem {
  user: UserOut;       // opcional si quieres incluir info del usuario
  comment_detail: string;
  rating: number;
  date_created: string;
}

export interface RatingCommentsCourseUpdate {
  comment_detail?: string;
  rating?: number;
}
