import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateModuleRequest, EditModule, ModuleCourseResponse } from '../../models/detail_course.model';
import { API_ROUTES } from '../../constants/api.routes';

@Injectable({
  providedIn: 'root'
})
export class ModuleCoursesService {
  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient){} 
  getModules(id_course:number):Observable<ModuleCourseResponse[]>{
    return this.http.get<ModuleCourseResponse[]>(this.baseUrl+API_ROUTES.module_course.get_modules+id_course);
  }
  createModule(id_course:number, moduleData:CreateModuleRequest):Observable<ModuleCourseResponse>{
    return this.http.post<ModuleCourseResponse>(this.baseUrl+API_ROUTES.module_course.create_module+id_course, moduleData);
  }
  getModuleById(id_module:number):Observable<ModuleCourseResponse>{
    return this.http.get<ModuleCourseResponse>(this.baseUrl+API_ROUTES.module_course.get_module+id_module);
  }
  editModule(id_module:number, moduleData:EditModule):Observable<ModuleCourseResponse>{
    return this.http.put<ModuleCourseResponse>(this.baseUrl+API_ROUTES.module_course.edit_module+id_module, moduleData);
  }
  deleteModule(id_module:number):Observable<ModuleCourseResponse>{
    return this.http.patch<ModuleCourseResponse>(this.baseUrl+API_ROUTES.module_course.delete_module+id_module, {});
  }
}