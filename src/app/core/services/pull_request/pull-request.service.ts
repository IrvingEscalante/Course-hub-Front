import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PullRequestBasicOut } from '../../models/pull_request.model';
import { API_ROUTES } from '../../constants/api.routes';

@Injectable({
  providedIn: 'root'
})
export class PullRequestService {
  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient){}

  getPulls(id_course:number):Observable<PullRequestBasicOut[]>{
    return this.http.get<PullRequestBasicOut[]>(this.baseUrl+API_ROUTES.pull_request.get_pulls+id_course);
  }
}
