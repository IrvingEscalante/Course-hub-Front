import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RatingCommentsCourseUpdate, RatingCommentsCreate, RatingCommentsResponse } from '../../models/rating_comments';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../../constants/api.routes';
import { MessageResponse } from '../../models/auth.model';

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
  deleteRating(id_rating:number): Observable<MessageResponse>{
    return this.http.delete<MessageResponse>(this.baseUrl+API_ROUTES.rating_comments.deleteRating+id_rating);
  }
  updateRating(id_rating:number, rating_in:RatingCommentsCourseUpdate):  Observable<RatingCommentsResponse>{
    return this.http.patch<RatingCommentsResponse>(this.baseUrl+API_ROUTES.rating_comments.updateRating+id_rating, rating_in);
  }
}
