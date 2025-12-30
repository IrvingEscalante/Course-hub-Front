import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { YoutubePlayer } from "../course-content-publication/youtube-player/youtube-player";
import { CoursePublishResponse } from '../../../../core/models/detail_course.model';
import { SafeUrlPipe } from '../../../pipes/safeurlpipe-pipe';
import { environment } from '../../../../../environments/environment';
import { YouTubePlayer } from "@angular/youtube-player";
import { PublicationsService } from '../../../../core/services/courses/publications.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ModalConfirmation } from '../../modal-confirmation/modal-confirmation';

@Component({
  selector: 'app-course-publication',
  imports: [SafeUrlPipe, YouTubePlayer, ModalConfirmation],
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

  getFilename(path: string): string {
    const fullName = path.split('/').pop() || path;
    // Remover el prefijo de ID si existe (ej: "123_archivo.pdf" -> "archivo.pdf")
    const parts = fullName.split('_');
    if (parts.length > 1 && !isNaN(Number(parts[0]))) {
      return parts.slice(1).join('_');
    }
    return fullName;
  }

  getFileExtension(path: string): string {
    const ext = path.split('.').pop()?.toUpperCase() || 'FILE';
    return ext;
  }

  hasPdfContent(): boolean {
    if (!this.publication?.content) return false;
    return this.publication.content.some(c => 
      c.type_content === 'file' || 
      c.type_content === 'pdf' || 
      c.type_content === 'pptx' || 
      c.type_content === 'docx'
    );
  }

  extractYouTubeId(url: string): string | null {

  if (!url || typeof url !== 'string') return null;

  try {
    const parsedUrl = new URL(url);

    // 1. youtu.be/<id>
    if (parsedUrl.hostname.includes('youtu.be')) {
      const id = parsedUrl.pathname.replace('/', '');
      console.log(id);
      return id || null;
    }

    // 2. youtube.com/watch?v=<id>
    const vParam = parsedUrl.searchParams.get('v');
    if (vParam) return vParam;

    // 3. youtube.com/embed/<id>
    if (parsedUrl.pathname.includes('/embed/')) {
      const id = parsedUrl.pathname.split('/embed/')[1];
      return id || null;
    }

    // 4. Último intento: extraer ID mediante regex general
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    if (match) return match[1];

    return null;
  } catch {
    return null;
  }
}


  ngOnInit() {
  if (this.publication?.content) {

    const priority: Record<string, number> = {
      pdf: 1,
      pptx: 1,
      video: 2,
      youtube: 2,
      note: 3,
      image: 3,
      text: 3,
      other: 3
    };

    this.publication.content = [...this.publication.content].sort((a, b) => {
      const pa = priority[a.type_content] ?? 99;
      const pb = priority[b.type_content] ?? 99;
      return pa - pb;
    });

  }
}
  onAddContent() {
    console.log('Acción: Agregar contenido a la publicacion', this.publication.id_course_publish);
    this.addContent.emit(this.publication);
  }

  getPublications(){
    this.getpublications.emit();
  }

}
