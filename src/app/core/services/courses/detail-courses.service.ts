import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModuleCourseResponse } from '../../models/detail_course.model';
import { API_ROUTES } from '../../constants/api.routes';

@Injectable({
  providedIn: 'root'
})
export class DetailCourses {
  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient){}

  getModules(id_course:number):Observable<ModuleCourseResponse[]>{
    return this.http.get<ModuleCourseResponse[]>(this.baseUrl+API_ROUTES.detail_course.get_modules+id_course);
  }


}
