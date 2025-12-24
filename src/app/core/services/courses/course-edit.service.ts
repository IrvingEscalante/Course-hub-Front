import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.model';
import { environment } from '../../../../environments/environment';
import { API_ROUTES } from '../../constants/api.routes';

@Injectable({
  providedIn: 'root'
})
export class CourseEditService {
  private baseUrl = environment.apiUrl // Ajusta la URL base según tu backend

  constructor(private http: HttpClient) { }

  /**
   * Actualiza los datos básicos del curso (nombre, descripción, imagen)
   * @param courseId ID del curso
   * @param name Nombre del curso
   * @param description Descripción del curso
   * @param coverFile Archivo de imagen (opcional)
   * @returns Observable con el curso actualizado
   */
  updateCourseBasics(
    courseId: number,
    name: string,
    description: string,
    coverFile?: File
  ): Observable<Partial<Course>> {
    const formData = new FormData();
    formData.append('name_course', name);
    formData.append('description_course', description);
    
    if (coverFile) {
      formData.append('cover', coverFile);
    }

    return this.http.patch<Partial<Course>>(
      this.baseUrl+API_ROUTES.courses.edit_basics + courseId,
      formData
    );
  }
}
