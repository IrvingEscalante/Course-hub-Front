import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RatingCommentsCreate, RatingCommentsResponse } from '../../models/rating_comments';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../../constants/api.routes';

@Injectable({
  providedIn: 'root'
})
export class RatingCommentsService {
  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient){}

  createRating(payload: RatingCommentsCreate): Observable<RatingCommentsResponse> {
    return this.http.post<RatingCommentsResponse>(this.baseUrl+API_ROUTES.rating_comments.create, payload);
  }
  getAllComments(id_course:number): Observable<RatingCommentsResponse[]>{
    return this.http.get<RatingCommentsResponse[]>(this.baseUrl+API_ROUTES.rating_comments.getAllComments+id_course);
  }
}
