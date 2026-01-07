import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course, CourseBase } from '../../models/course.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_ROUTES } from '../../constants/api.routes';
import { ThemeResponse } from '../../models/theme.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient){}

  createCourse(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl+API_ROUTES.courses.create, formData);
  }
  getCourses(search?:string, typeQuery: 'all' | 'new' | 'popular' | 'trending' = 'all'): Observable<Course[]> {
    const params: any = {
      type_query: typeQuery
    };

    if (search) {
      params.search = search;
    }
    return this.http.get<Course[]>(`${this.baseUrl}${API_ROUTES.courses.courses_dashboard}`, {params});
  }
  getDetailCourse(id_course:number):Observable<Course>{
    return this.http.get<Course>(this.baseUrl+API_ROUTES.courses.course_detail+id_course);
  }
  getThemes():Observable<ThemeResponse[]>{
    return this.http.get<ThemeResponse[]>(this.baseUrl+API_ROUTES.themes.theme);
  }
  copyCourse(id_course : number):Observable<CourseBase>{
    return this.http.post<CourseBase>(this.baseUrl+API_ROUTES.courses.copy_course+id_course,{});
  }
  editCourse(id_course:number, formData:FormData):Observable<any>{
    return this.http.post(this.baseUrl+API_ROUTES.courses.edit_course+id_course, formData);
  }
  saveVersion(id_course: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/course/courses/${id_course}/commit`, {});
  }
  deactivateCourse(id_course: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/course/courses/${id_course}/deactivate-activate`, {});
  }
}
