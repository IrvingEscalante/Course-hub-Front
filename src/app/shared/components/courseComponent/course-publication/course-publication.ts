import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { YoutubePlayer } from "../course-content-publication/youtube-player/youtube-player";
import { CoursePublishResponse } from '../../../../core/models/detail_course.model';
import { environment } from '../../../../../environments/environment';
import { PublicationsService } from '../../../../core/services/courses/publications.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ModalConfirmation } from '../../modal-confirmation/modal-confirmation';
import { PublicationContentComponent } from './publication-content/publication-content.component';

@Component({
  selector: 'app-course-publication',
  imports: [ModalConfirmation, PublicationContentComponent],
  templateUrl: './course-publication.html',
  styleUrl: './course-publication.css'
})
export class CoursePublication {
  videoId:string = 'nKPbfIU442g';
  apiUrlBack = environment.apiUrlForStatics;
  publicationService = inject(PublicationsService);
  toastService = inject(ToastService);
  
  // Modal de confirmación
  isConfirmOpen: boolean = false;
  confirmingDelete: boolean = false;
  // Modal state removed; controlled by parent
  @Input() publication!: CoursePublishResponse;
  @Input() isMyCourse?: boolean;
  @Output() pdfClick = new EventEmitter<string>();
  @Output() imageClicked = new EventEmitter<string>();
  @Output() getpublications = new EventEmitter<void>();
  @Output() editPublication = new EventEmitter<CoursePublishResponse>();
  @Output() deletePublication = new EventEmitter<CoursePublishResponse>();
  @Output() addContent = new EventEmitter<CoursePublishResponse>();

  openPdf(url: string) {
    console.log(url);
    this.pdfClick.emit(url);
  }

  onEditPublication() {
    this.editPublication.emit(this.publication);
  }

  onDeletePublication() {
    this.isConfirmOpen = true;
  }

  onCancelDelete() {
    if (!this.confirmingDelete) {
      this.isConfirmOpen = false;
    }
  }

  confirmDeletePublication() {
    if (this.confirmingDelete) return;
    this.confirmingDelete = true;
    
    this.publicationService.deletePublication(this.publication.id_course_publish).subscribe({
      next: (resp) => {
        this.toastService.success("Se ha eliminado la publicación '" + resp.name_publication + "' correctamente");
        this.isConfirmOpen = false;
        this.getPublications();
      },
      error: (err) => {
        this.toastService.error(err.error?.detail || 'Error al eliminar la publicación');
      },
      complete: () => {
        this.confirmingDelete = false;
      }
    });
  }

  onPdfClick(url: string) {
    console.log(url);
    this.pdfClick.emit(url);
  }

  onImageClicked(url: string) {
    this.imageClicked.emit(url);
  }

  onAddContent() {
    console.log('Acción: Agregar contenido a la publicacion', this.publication.id_course_publish);
    this.addContent.emit(this.publication);
  }

  getPublications(){
    this.getpublications.emit();
  }
}
