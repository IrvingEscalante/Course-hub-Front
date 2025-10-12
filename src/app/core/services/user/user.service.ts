import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserOut } from '../../models/user.model';
import { API_ROUTES } from '../../constants/api.routes';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl; 

  constructor(private http:HttpClient){}

  getUser():Observable<UserOut>{
    return this.http.get<UserOut>(`${this.baseUrl}${API_ROUTES.users.profile}`);
  }
}
