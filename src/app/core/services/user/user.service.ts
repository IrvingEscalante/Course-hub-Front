import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserFollow, UserOut } from '../../models/user.model';
import { API_ROUTES } from '../../constants/api.routes';
import { MessageResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl; 

  constructor(private http:HttpClient){}

  getUser():Observable<UserOut>{
    return this.http.get<UserOut>(`${this.baseUrl}${API_ROUTES.users.profile}`);
  }

  addDeleteFavorites(id_course:number):Observable<MessageResponse>{
    return this.http.post<MessageResponse>(`${this.baseUrl}${API_ROUTES.favorites.add_delete_favorites}/${id_course}`, {});
  }
  getFavorites(username:string):Observable<number[]>{
    return this.http.get<number[]>(`${this.baseUrl}${API_ROUTES.favorites.get_favorites}${username}`);
  }
  followUnfollow(username:string):Observable<UserFollow>{
    return this.http.post<UserFollow>(`${this.baseUrl}${API_ROUTES.follow.follow_unfollow}${username}`, {});
  }

}
