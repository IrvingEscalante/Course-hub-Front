import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseFullResponse, CoursePublishResponse, CreateModuleRequest, ModuleCourseResponse } from '../../models/detail_course.model';
import { API_ROUTES } from '../../constants/api.routes';

@Injectable({
  providedIn: 'root'
})
export class DetailCourses {
  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient){}

  getPublications(id_module:number):Observable<CoursePublishResponse[]>{
    return this.http.get<CoursePublishResponse[]>(this.baseUrl+API_ROUTES.detail_course.get_publications+id_module);
  }
  getFulldataCourse(id_course:number):Observable<CourseFullResponse>{
    return this.http.get<CourseFullResponse>(this.baseUrl+API_ROUTES.detail_course.get_full_data_course+id_course);
  }
}
