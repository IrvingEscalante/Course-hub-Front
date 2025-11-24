export interface ModuleCourseResponse {
  id_module: number;
  id_course: number;
  name_module: string;
  description_module: string;
  status_module: boolean;
  order_index: number;
  date_created: string; 
}

export interface ContentCoursePublishResponse {
    id_content_course_publish: number;
    id_course_publish: number;
    content: string;
    status: boolean;
}

export interface CoursePublishResponse {
    id_course_publish: number;
    id_module: number;
    name_publication: string;
    description: string;
    date_created: string;
    date_updated?: string | null; 
    status_publish: boolean;
    content?: ContentCoursePublishResponse[]; 
}