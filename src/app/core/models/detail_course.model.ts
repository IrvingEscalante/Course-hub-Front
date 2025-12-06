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
    type_content:string;
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


export interface ResourceResponse {
  id_content_course_publish: number;
  id_course_publish: number;
  content: string;
  status: boolean;
  type_content: string;
}

export interface PublicationResponse {
  id_course_publish: number;
  id_module: number;
  name_publication: string;
  description: string | null;
  date_created: string | null;   // o Date si prefieres: Date | null
  date_updated: string | null;   // ""
  status_publish: boolean;
  content: ResourceResponse[];
}

export interface ModuleResponse {
  id_module: number;
  id_course: number;
  name_module: string;
  description_module: string | null;
  status_module: boolean;
  order_index: number;
  date_created: string | null;   // o Date | null
  course_publish: PublicationResponse[];
}

export interface CourseFullResponse {
  id_course: number;
  name_course: string;
  description_course: string;
  image: string;
  is_forked: boolean;
  id_theme: number;
  status_course: boolean | null;
  modules: ModuleResponse[];
}
