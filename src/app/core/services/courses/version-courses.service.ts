import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CourseVersionTable } from '../../models/version_course.model';
import { environment } from '../../../../environments/environment';
import { API_ROUTES } from '../../constants/api.routes';

@Injectable({
  providedIn: 'root'
})
export class VersionCoursesService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las versiones de un curso
   */
  getVersionsByCourse(id_course: number): Observable<CourseVersionTable[]> {
    return this.http.get<CourseVersionTable[]>(
      `${this.baseUrl}${API_ROUTES.versions.get_versions_by_course}${id_course}/versions`
    );
  }

  /**
   * Obtiene una versión específica de un curso
   */
  getVersion(id_course: number, id_version: number): Observable<CourseVersionTable> {
    return this.http.get<CourseVersionTable>(
      `${this.baseUrl}${API_ROUTES.versions.get_version}${id_course}/versions/${id_version}`
    );
  }

  /**
   * Obtiene la versión más reciente de un curso
   */
  getLatestVersion(id_course: number): Observable<CourseVersionTable> {
    return this.http.get<CourseVersionTable>(
      `${this.baseUrl}${API_ROUTES.versions.get_latest_version}${id_course}/versions/latest`
    );
  }
}
