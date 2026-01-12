import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseVersionTable, CourseVersionListResponse } from '../../../core/models/version_course.model';
import { VersionCoursesService } from '../../../core/services/courses/version-courses.service';
import { LoaderService } from '../../../core/services/loader';
import { ToastService } from '../../../core/services/toast.service';
import { ModuleResponse, ModuleCourseResponse, CoursePublishResponse, ContentCoursePublishResponse } from '../../../core/models/detail_course.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-course-version',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-version.html',
  styleUrl: './course-version.css'
})
export class CourseVersionPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private versionService = inject(VersionCoursesService);
  private loaderService = inject(LoaderService);
  private toastService = inject(ToastService);
  private renderer = inject(Renderer2);

  currentVersion: CourseVersionTable | null = null;
  availableVersions: CourseVersionListResponse[] = [];
  idCourse: number = 0;
  selectedVersionId: number = 0;
  isLoading: boolean = true;
  displayModules: (ModuleCourseResponse & { course_publish: CoursePublishResponse[] })[] = [];
  openModuleId: number | null = null;

  // Image modal state
  isImageModalOpen = false;
  selectedImageUrl: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idCourseParam = Number(params.get('id'));
      const idVersionParam = Number(params.get('versionId'));
      
      if (!idCourseParam) {
        this.toastService.error('ID del curso no válido');
        this.router.navigate(['/courses']);
        return;
      }

      this.idCourse = idCourseParam;
      this.loadVersions(idCourseParam, idVersionParam);
    });
  }

  private loadVersions(idCourse: number, selectedVersionId?: number) {
    this.isLoading = true;
    this.loaderService.show();

    this.versionService.getVersionsByCourse(idCourse).subscribe({
      next: (versions) => {
        // Convertir a CourseVersionListResponse si es necesario
        this.availableVersions = versions as CourseVersionListResponse[];
        this.availableVersions.sort((a, b) => b.version_number - a.version_number);
        
        if (this.availableVersions.length === 0) {
          this.toastService.error('No hay versiones disponibles para este curso');
          this.isLoading = false;
          this.loaderService.hide();
          return;
        }

        // Si se proporciona un ID de versión específico, cargarlo
        const versionIdToLoad = selectedVersionId || this.availableVersions[0].id_version;
        this.selectedVersionId = versionIdToLoad;
        this.loadVersion(idCourse, versionIdToLoad);
      },
      error: (err) => {
        console.error('Error cargando versiones:', err);
        this.toastService.error('Error al cargar las versiones');
        this.isLoading = false;
        this.loaderService.hide();
      }
    });
  }

  private loadVersion(idCourse: number, idVersion: number) {
    this.versionService.getVersion(idCourse, idVersion).subscribe({
      next: (version) => {
        console.log('Versión cargada:', version);
        this.currentVersion = version;
        this.selectedVersionId = idVersion;
        
        // Mapear ModuleResponse a ModuleCourseResponse y convertir null a string vacío
        this.displayModules = (version.snapshot.modules || []).map(m => {
          // Convertir PublicationResponse a CoursePublishResponse
          const convertedPublications: CoursePublishResponse[] = (m.course_publish || []).map(pub => ({
            id_course_publish: pub.id_course_publish,
            id_module: pub.id_module,
            name_publication: pub.name_publication,
            description: pub.description || '', // null -> string vacío
            date_created: pub.date_created || '',
            date_updated: pub.date_updated || null,
            status_publish: pub.status_publish,
            content: pub.content || []
          }));

          return {
            id_module: m.id_module,
            id_course: m.id_course,
            name_module: m.name_module,
            description_module: m.description_module || '', // null -> string vacío
            status_module: m.status_module,
            order_index: m.order_index,
            date_created: m.date_created || '',
            course_publish: convertedPublications
          };
        });
        
        this.isLoading = false;
        this.loaderService.hide();
      },
      error: (err) => {
        console.error('Error cargando versión:', err);
        this.toastService.error('Error al cargar la versión');
        this.isLoading = false;
        this.loaderService.hide();
      }
    });
  }

  onVersionChange(versionId: number) {
    this.loadVersion(this.idCourse, versionId);
  }

  goBackToCourse() {
    this.router.navigate(['/course/detail', this.idCourse]);
  }

  toggleModule(moduleId: number) {
    this.openModuleId = this.openModuleId === moduleId ? null : moduleId;
  }

  hasPdfContent(content: ContentCoursePublishResponse[]): boolean {
    return content.some(c => 
      c.type_content === 'file' || c.type_content === 'pdf' || 
      c.type_content === 'pptx' || c.type_content === 'docx'
    );
  }

  getFileExtension(url: string): string {
    return url.split('.').pop()?.toLowerCase() || 'file';
  }

  getFilename(url: string): string {
    const fullName = url.split('/').pop() || url;
    const parts = fullName.split('_');
    if (parts.length > 1 && !isNaN(Number(parts[0]))) {
      return parts.slice(1).join('_');
    }
    return fullName;
  }

  extractYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  getYouTubeEmbedUrl(videoId: string | null): string {
    if (!videoId) return '';
    return `https://www.youtube.com/embed/${videoId}`;
  }

  openPdf(url: string) {
    const fullUrl = environment.apiUrlForStatics + url;
    window.open(fullUrl, '_blank');
  }

  openImageModal(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
    this.isImageModalOpen = true;
    this.renderer.addClass(document.body, 'modal-open');
  }

  closeImageModal() {
    this.isImageModalOpen = false;
    this.selectedImageUrl = '';
    this.renderer.removeClass(document.body, 'modal-open');
  }

  onImageBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('image-modal-backdrop')) {
      this.closeImageModal();
    }
  }
}
