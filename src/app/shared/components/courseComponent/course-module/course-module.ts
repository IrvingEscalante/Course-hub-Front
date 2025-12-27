import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CoursePublishResponse, ModuleCourseResponse, CreateModuleRequest, EditModule } from '../../../../core/models/detail_course.model';
import { DetailCourses } from '../../../../core/services/courses/detail-courses.service';
import { ModuleCoursesService } from '../../../../core/services/courses/module-courses.service';
import { CoursePublication } from "../course-publication/course-publication";
import { environment } from '../../../../../environments/environment';
import { CourseModal, ModalData } from '../course-modal/course-modal';
import { LoaderService } from '../../../../core/services/loader';
import { Toast } from 'ngx-toastr';
import { ToastService } from '../../../../core/services/toast.service';
import { ModalConfirmation } from '../../modal-confirmation/modal-confirmation';

@Component({
  selector: 'app-course-module',
  imports: [CoursePublication, CourseModal, ModalConfirmation],
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
  @Input() moduleCourse!:ModuleCourseResponse;
  @Input() isMyCourse?: boolean;
  publications: CoursePublishResponse[] = [];
  hasLoaded: boolean = false;
  pdfModalUrl?: string;
  @Output() getmodules = new EventEmitter<number>();
  initialModalData?: ModalData;

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
      this.getPublications(this.moduleCourse.id_module);
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
    this.modalActionType = 'add';
    this.modalElementType = 'publication';
    this.isModalOpen = true;
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
          // Actualizar estado local
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

    if (this.modalElementType === 'publication') {
      console.log('ID del módulo (para publicación):', this.moduleCourse.id_module);
    } else if (this.modalElementType === 'content') {
      console.log('Agregando contenido a publicación');
    }

    this.isModalOpen = false;
  }

  openAddContentModal() {
    this.initialModalData = undefined;
    this.modalActionType = 'add';
    this.modalElementType = 'content';
    this.isModalOpen = true;
  }

  getModules(){
   this.getmodules.emit(this.moduleCourse.id_module);
  }
}
