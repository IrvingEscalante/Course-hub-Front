import { Course } from "./course.model";

export interface UserOut{
  username:string;
  name: string;
  lastname:string;
  email: string;
  photo:string;
  back_photo:string | null;
  biography:string | null;
}

export interface UserOutFollow{
  username:string;
  name: string;
  lastname:string;
  photo:string;
  is_following:boolean;
}

export interface UserProfilePublic {
  username: string;
  name: string;
  lastname: string;
  photo: string | null;
  back_photo : string | null;
  biography: string | null;
  date_joined: string; // o Date
  is_my_profile: boolean;
  followers_count : number
  following_count : number
  following : boolean
  mutual : boolean
  courses_create: Course[];
  courses_favorites: Course[];
}

export interface UserProfilePrivate extends UserProfilePublic {
  id: number;
  email: string;
}

export interface UserFollow{
  username:string;
  name:string;
  lastname:string;
  photo:string;
  following:boolean;
}