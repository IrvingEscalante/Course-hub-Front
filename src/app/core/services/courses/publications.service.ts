import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../../constants/api.routes';
import { ContentPayload } from '../../../shared/components/courseComponent/course-modal/course-modal';

export interface PublicationContent {
  id_content_course_publish: number;
  id_course_publish: number;
  content: string;
  status: boolean;
  type_content: string;
}

export interface PublicationResponse {
  id_course_publish: number;
  id_module: number;
  name_publication: string;
  description: string;
  date_created: string;
  date_updated: string | null;
  status_publish: boolean;
  content: PublicationContent[];
}

export interface ContentMetadata {
  type: string;
  file_index?: number;
  url?: string;
  text?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {
  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  getPublicationById(id_publication: number): Observable<PublicationResponse> {
    return this.http.get<PublicationResponse>(
      `${this.baseUrl}${API_ROUTES.publications.get_by_id}${id_publication}`
    );
  }

  /**
   * Crear una publicación con múltiples contenidos
   * @param id_module ID del módulo donde se crea la publicación
   * @param title Título de la publicación
   * @param description Descripción de la publicación
   * @param contents Array de contenidos (imágenes, videos, notas, archivos)
   */
  createPublication(
    id_module: number,
    title: string,
    description: string,
    contents: ContentPayload[]
  ): Observable<PublicationResponse> {
    const formData = new FormData();
    
    // Agregar datos básicos
    formData.append('name_publication', title);
    formData.append('description', description);
    
    // Construir metadatos y agregar archivos
    const contentsMetadata: ContentMetadata[] = [];
    let fileIndex = 0;
    
    for (const content of contents) {
      if (content.type === 'image' || content.type === 'file') {
        if (content.file) {
          formData.append('files', content.file);
          contentsMetadata.push({
            type: content.type,
            file_index: fileIndex
          });
          fileIndex++;
        }
      } else if (content.type === 'video') {
        contentsMetadata.push({
          type: 'video',
          url: content.videoUrl
        });
      } else if (content.type === 'note') {
        contentsMetadata.push({
          type: 'note',
          text: content.note
        });
      }
    }
    
    formData.append('contents_metadata', JSON.stringify(contentsMetadata));
    
    return this.http.post<PublicationResponse>(
      `${this.baseUrl}${API_ROUTES.publications.create}${id_module}`,
      formData
    );
  }

  /**
   * Eliminar un contenido específico de una publicación
   */
  deleteContent(id_content: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}${API_ROUTES.publications.delete_content}${id_content}`
    );
  }
  deletePublication(id_publication: number): Observable<PublicationResponse>{
    return this.http.patch<PublicationResponse>(this.baseUrl+API_ROUTES.publications.delete_publication+id_publication, {});
  }
}
