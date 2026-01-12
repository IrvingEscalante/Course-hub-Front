import { Component, EventEmitter, inject, Input, Output, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursePublishResponse, ModuleCourseResponse, CreateModuleRequest, EditModule, ContentCoursePublishResponse } from '../../../../core/models/detail_course.model';
import { DetailCourses } from '../../../../core/services/courses/detail-courses.service';
import { ModuleCoursesService } from '../../../../core/services/courses/module-courses.service';
import { PublicationsService, PublicationResponse } from '../../../../core/services/courses/publications.service';
import { CoursePublication } from "../course-publication/course-publication";
import { environment } from '../../../../../environments/environment';
import { CourseModal, ModalData, ContentPayload } from '../course-modal/course-modal';
import { LoaderService } from '../../../../core/services/loader';
import { Toast } from 'ngx-toastr';
import { ToastService } from '../../../../core/services/toast.service';
import { ModalConfirmation } from '../../modal-confirmation/modal-confirmation';

@Component({
  selector: 'app-course-module',
  imports: [CoursePublication, CourseModal, ModalConfirmation, CommonModule],
  templateUrl: './course-module.html',
  styleUrl: './course-module.css'
})
export class CourseModule {
  isModalOpen: boolean = false;
  modalActionType: 'add' | 'edit' = 'add';
  modalElementType: 'module' | 'publication' | 'content' = 'publication';
  isOpen:boolean = false;
  isConfirmOpen: boolean = false;
  confirmingDelete: boolean = false;
  confirmTitle: string = '';
  confirmDescription: string = '';
  toastService=inject(ToastService);
  loaderService=inject(LoaderService);
  detailService=inject(DetailCourses);
  moduleService=inject(ModuleCoursesService);
  publicationsService=inject(PublicationsService);
  private renderer = inject(Renderer2);
  @Input() moduleCourse!:ModuleCourseResponse;
  @Input() isMyCourse?: boolean;
  @Input() preloadedPublications?: CoursePublishResponse[]; // Publicaciones precargadas (opcional)
  publications: CoursePublishResponse[] = [];
  hasLoaded: boolean = false;
  pdfModalUrl?: string;
  
  // Image modal state
  isImageModalOpen = false;
  selectedImageUrl: string = '';

  @Output() getmodules = new EventEmitter<number>();
  initialModalData?: ModalData;
  currentEditingPublicationId?: number;

  openPdf(url: string) {
    const fullUrl = environment.apiUrlForStatics+url
    window.open(fullUrl, "_blank");
    console.log(url);
  }

closePdf() {
  this.pdfModalUrl = undefined;
}


  togglePublication(){

    this.isOpen = !this.isOpen;

     if (this.isOpen && !this.hasLoaded) {
      // Si hay publicaciones precargadas, usarlas directamente
      if (this.preloadedPublications && this.preloadedPublications.length > 0) {
        this.publications = this.preloadedPublications;
        this.hasLoaded = true;
      } else {
        // Si no, cargar desde la API
        this.getPublications(this.moduleCourse.id_module);
      }
    }
  }

  getPublications(id_module:number){
    this.detailService.getPublications(id_module).subscribe({
      next:(data)=>{
        console.log("publis:", data);
        this.publications = data;
        this.hasLoaded = true;
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  onAddPublication() {
    console.log('Acción: Agregar publicación al módulo', this.moduleCourse.id_module);
    this.initialModalData = undefined; // Limpiar datos previos
    this.currentEditingPublicationId = undefined;
    this.modalActionType = 'add';
    this.modalElementType = 'publication';
    this.isModalOpen = true;
  }

  onEditPublication(publication: CoursePublishResponse) {
    console.log('Acción: Editar publicación', publication.id_course_publish);
    this.loaderService.show();
    this.currentEditingPublicationId = publication.id_course_publish;
    
    // Obtener los datos completos de la publicación
    this.publicationsService.getPublicationById(publication.id_course_publish).subscribe({
      next: (fullPublication: PublicationResponse) => {
        // Convertir los contenidos existentes al formato ContentPayload
        const existingContents: ContentPayload[] = (fullPublication.content || []).map(content => {
          const contentPayload: ContentPayload = {
            type: this.mapContentType(content.type_content),
            isExisting: true,
            existingId: content.id_content_course_publish,
            existingUrl: content.content
          };
          
          // Mapear según el tipo
          if (content.type_content === 'image') {
            contentPayload.imagePreview = content.content;
            contentPayload.fileName = this.getFilenameFromUrl(content.content);
          } else if (content.type_content === 'video-embed') {
            contentPayload.videoUrl = content.content;
          } else if (content.type_content === 'note') {
            contentPayload.note = content.content;
          } else if (content.type_content === 'file' || content.type_content === 'pdf' || content.type_content === 'pptx' || content.type_content === 'docx') {
            contentPayload.fileName = this.getFilenameFromUrl(content.content);
          }
          
          return contentPayload;
        });

        this.initialModalData = {
          title: fullPublication.name_publication,
          description: fullPublication.description || '',
          contents: existingContents
        };
        
        this.modalActionType = 'edit';
        this.modalElementType = 'publication';
        this.isModalOpen = true;
        this.loaderService.hide();
      },
      error: (err) => {
        console.error('Error al obtener publicación:', err);
        this.toastService.error('Error al cargar los datos de la publicación');
        this.loaderService.hide();
      }
    });
  }

  private mapContentType(type: string): 'image' | 'video' | 'note' | 'file' {
    switch (type) {
      case 'image': return 'image';
      case 'video': return 'video';
      case 'note': return 'note';
      case 'file':
      case 'pdf':
      case 'pptx':
      case 'docx':
        return 'file';
      default: return 'note';
    }
  }

  private getFilenameFromUrl(url: string): string {
    const fullName = url.split('/').pop() || url;
    const parts = fullName.split('_');
    if (parts.length > 1 && !isNaN(Number(parts[0]))) {
      return parts.slice(1).join('_');
    }
    return fullName;
  }

  onEditModule() {
    console.log('Acción: Editar módulo', this.moduleCourse.id_module);
    this.modalActionType = 'edit';
    this.modalElementType = 'module';
    // Obtener datos del módulo por ID y prefijar en el modal
    this.moduleService.getModuleById(this.moduleCourse.id_module).subscribe({
      next: (mod) => {
        this.initialModalData = {
          title: mod.name_module,
          description: mod.description_module || ''
        };
        this.isModalOpen = true;
      },
      error: (err) => {
        console.log('Error al obtener módulo:', err);
        // Abrir modal igualmente para permitir edición manual
        this.isModalOpen = true;
      }
    });
  }
  onDeleteModule(){
    this.confirmTitle = 'Eliminar módulo';
    this.confirmDescription = `¿Deseas eliminar el módulo "${this.moduleCourse.name_module}"? Esta acción no se puede deshacer.`;
    this.isConfirmOpen = true;
  }

  onCancelDelete(){
    if (!this.confirmingDelete) {
      this.isConfirmOpen = false;
    }
  }

  confirmDeleteModule(){
    if (this.confirmingDelete) return;
    this.confirmingDelete = true;
    this.loaderService.show();
    this.moduleService.deleteModule(this.moduleCourse.id_module).subscribe({
      next:(data)=>{
        this.toastService.success("El modulo "+data.name_module+" ha sido eliminado correctamente");
        this.getModules();
        this.isConfirmOpen = false;
      },error:(err)=>{
        console.log(err);
        this.toastService.error("Ocurrió un error inesperado");
      },complete:()=>{
        this.confirmingDelete = false;
        this.loaderService.hide();
      }
    })
  }
  onModalClose() {
    this.isModalOpen = false;
  }

  onModalSubmit(data: ModalData) {
    this.loaderService.show();
    console.log('Datos del formulario:', data);
    console.log('Tipo de elemento:', this.modalElementType, 'Acción:', this.modalActionType);

    // Editar módulo
    if (this.modalElementType === 'module' && this.modalActionType === 'edit') {
      const payload: EditModule = {
        id_module: this.moduleCourse.id_module,
        name_module: data.title,
        description_module: data.description,
        status_module: this.moduleCourse.status_module,
        order_index: this.moduleCourse.order_index
      };

      this.moduleService.editModule(this.moduleCourse.id_module, payload).subscribe({
        next: (updated) => {
          this.moduleCourse = { ...this.moduleCourse, ...updated };
          console.log('Módulo actualizado exitosamente:', updated);
          this.loaderService.hide();
          this.toastService.success('Módulo actualizado exitosamente');
          this.isModalOpen = false;
        },
        error: (err) => {
          console.log('Error al actualizar módulo:', err);
          this.loaderService.hide();
          this.toastService.error(err.error?.detail || 'Error al actualizar el módulo');
          this.isModalOpen = false;
        }
      });
      return;
    }

    // Crear publicación
    if (this.modalElementType === 'publication' && this.modalActionType === 'add') {
      if (!data.contents || data.contents.length === 0) {
        this.loaderService.hide();
        this.toastService.error('Debes agregar al menos un contenido a la publicación');
        return;
      }

      this.publicationsService.createPublication(
        this.moduleCourse.id_module,
        data.title,
        data.description,
        data.contents
      ).subscribe({
        next: (newPublication) => {
          console.log('Publicación creada exitosamente:', newPublication);
          this.loaderService.hide();
          this.toastService.success('Publicación creada exitosamente');
          this.isModalOpen = false;
          
          // Actualizar lista de publicaciones
          if (this.hasLoaded) {
            this.getPublications(this.moduleCourse.id_module);
          }
          // Si el módulo está cerrado, abrirlo para mostrar la nueva publicación
          if (!this.isOpen) {
            this.isOpen = true;
            this.getPublications(this.moduleCourse.id_module);
          }
        },
        error: (err) => {
          console.log('Error al crear publicación:', err);
          this.loaderService.hide();
          this.toastService.error(err.error?.detail || 'Error al crear la publicación');
        }
      });
      return;
    }

    // Editar publicación
    if (this.modalElementType === 'publication' && this.modalActionType === 'edit') {
      if (!this.currentEditingPublicationId) {
        this.loaderService.hide();
        this.toastService.error('Error: No se encontró la publicación a editar');
        return;
      }

      if (!data.contents || data.contents.length === 0) {
        this.loaderService.hide();
        this.toastService.error('Debes tener al menos un contenido en la publicación');
        return;
      }

      this.publicationsService.editPublication(
        this.currentEditingPublicationId,
        data.title,
        data.description,
        data.contents,
        data.deletedContentIds || []
      ).subscribe({
        next: (updatedPublication) => {
          console.log('Publicación actualizada exitosamente:', updatedPublication);
          this.loaderService.hide();
          this.toastService.success('Publicación actualizada exitosamente');
          this.isModalOpen = false;
          this.currentEditingPublicationId = undefined;
          
          // Actualizar lista de publicaciones
          this.getPublications(this.moduleCourse.id_module);
        },
        error: (err) => {
          console.log('Error al actualizar publicación:', err);
          this.loaderService.hide();
          this.toastService.error(err.error?.detail || 'Error al actualizar la publicación');
        }
      });
      return;
    }

    // Agregar contenido (para implementar después)
    if (this.modalElementType === 'content') {
      console.log('Agregando contenido a publicación');
      this.loaderService.hide();
    }

    this.isModalOpen = false;
  }

  openAddContentModal() {
    this.initialModalData = undefined;
    this.modalActionType = 'add';
    this.modalElementType = 'content';
    this.isModalOpen = true;
  }

  // Image modal methods
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

  getModules(){
   this.getmodules.emit(this.moduleCourse.id_module);
  }
}
