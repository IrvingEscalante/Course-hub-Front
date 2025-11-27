import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.model';
import { API_ROUTES } from '../../constants/api.routes';
import { MessageResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient){}

  getFavorites(username:string):Observable<Course[]>{
    return this.http.get<Course[]>(this.baseUrl+API_ROUTES.favorites.get_favorites+username);
  }
  addDeleteFavorites(id_course:number):Observable<MessageResponse>{
      return this.http.post<MessageResponse>(this.baseUrl+API_ROUTES.favorites.add_delete_favorites+id_course, {});
  }
}
