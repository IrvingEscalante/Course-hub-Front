import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PullRequestBasicOut, PullRequestChange, PullRequestChangesResponse } from '../../models/pull_request.model';
import { API_ROUTES } from '../../constants/api.routes';

@Injectable({
  providedIn: 'root'
})
export class PullRequestService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getPulls(id_course: number): Observable<PullRequestBasicOut[]> {
    return this.http.get<PullRequestBasicOut[]>(
      this.baseUrl + API_ROUTES.pull_request.get_pulls + id_course
    );
  }

  getMyPullRequests(id_course: number): Observable<PullRequestBasicOut[]> {
    return this.http.get<PullRequestBasicOut[]>(
      this.baseUrl + API_ROUTES.pull_request.get_my_pulls + id_course
    );
  }

  createPullRequest(payload: any): Observable<PullRequestBasicOut> {
    return this.http.post<PullRequestBasicOut>(
      this.baseUrl + '/pull-request/create',
      payload
    );
  }


  getPRById(id: number | string): Observable<PullRequestBasicOut> {
    return this.http.get<PullRequestBasicOut>(
      `${this.baseUrl}/pull-request/${id}`
    );
  }

  getPRChanges(id: number): Observable<PullRequestChangesResponse> {
    return this.http.get<PullRequestChangesResponse>(
      `${this.baseUrl}/pull-request/${id}/changes`
    );
  }

  acceptPR(id: number): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}/pull-request/${id}/accept`,
      {}
    );
  }

  rejectPR(id: number): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}/pull-request/${id}/reject`,
      {}
    );
  }
}
