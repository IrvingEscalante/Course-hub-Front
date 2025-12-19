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

  followUnfollow(username:string):Observable<UserFollow>{
    return this.http.post<UserFollow>(`${this.baseUrl}${API_ROUTES.follow.follow_unfollow}${username}`, {});
  }

  editProfile(formData:FormData):Observable<UserOut>{
    return this.http.patch<UserOut>(this.baseUrl+API_ROUTES.users.edit_profile, formData);
  }

}
