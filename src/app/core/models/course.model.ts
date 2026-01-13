import { UserOut } from "./user.model";

export interface Course {
  id_course: number;
  id_course_parent:number;
  name_course: string;
  description_course: string;
  image: string;
  is_forked: boolean;
  is_my_course?: boolean,
  date_created: Date;
  date_updated: Date | null;
  id_user: number;
  id_author_user: number;
  avg_rating:number;
  ratings_count:number;
  ratings_breakdown: {
    1: { count: number; percentage: number };
    2: { count: number; percentage: number };
    3: { count: number; percentage: number };
    4: { count: number; percentage: number };
    5: { count: number; percentage: number };
  };
  id_theme: number;
  status_course: boolean;
  is_favorite:boolean;
  is_my_favorite:boolean;
  num_videos: number | 0;
  num_files: number | 0;
  num_embed: number | 0;
  num_notes: number | 0;
  num_images: number | 0;
  user: UserOut;     
  author: UserOut;  
}

export interface CourseBase {
  id_course: number;
  name_course: string;
  description_course: string;
  image: string;
  is_forked: boolean;
  id_theme: number;
  status_course?: boolean;
}


