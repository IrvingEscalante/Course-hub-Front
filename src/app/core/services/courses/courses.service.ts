import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course } from '../../models/course.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_ROUTES } from '../../constants/api.routes';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient){}
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}${API_ROUTES.courses.courses_dashboard}`);
  }
  getDetailCourse(id_course:number):Observable<Course>{
    return this.http.get<Course>(`${this.baseUrl}${API_ROUTES.courses.course_detail}${id_course}`);
  }
}
