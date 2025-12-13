import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserFollow, UserOutFollow } from '../../models/user.model';
import { API_ROUTES } from '../../constants/api.routes';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient){}

  getFollowers(username:string):Observable<UserOutFollow[]>{
    return this.http.get<UserOutFollow[]>(this.baseUrl+API_ROUTES.follow.get_followers+username);
  }
  getFollowing(username:string){
    return this.http.get<UserOutFollow[]>(this.baseUrl+API_ROUTES.follow.get_following+username);
  }
}
