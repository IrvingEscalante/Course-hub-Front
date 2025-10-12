import { Course } from "./course.model";

export interface UserOut{
  username:string;
  name: string;
  lastname:string;
  email: string;
  photo:string;
}

export interface UserProfilePublic {
  username: string;
  name: string;
  lastname: string;
  photo: string | null;
  biography: string | null;
  date_joined: string; // o Date
  courses: Course[];
}

export interface UserProfilePrivate extends UserProfilePublic {
  id: number;
  email: string;
}