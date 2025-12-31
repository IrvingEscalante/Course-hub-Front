import { Component, inject } from '@angular/core';
import { CourseComments } from "../../../shared/components/courseComponent/course-comments/course-comments";
import { CoursesService } from '../../../core/services/courses/courses.service';
import { Course, CourseBase } from '../../../core/models/course.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DetailCourses } from '../../../core/services/courses/detail-courses.service';
import { ModuleCourseResponse } from '../../../core/models/detail_course.model';
import { CourseModule } from "../../../shared/components/courseComponent/course-module/course-module";
import { LoaderService } from '../../../core/services/loader';
import { Avatar } from "../../../shared/components/avatar/avatar";
import { ToastService } from '../../../core/services/toast.service';
import { PullRequest } from '../../../shared/components/pull-request-components/pull-request/pull-request';
import { PullRequestBasicOut } from '../../../core/models/pull_request.model';
import { PullRequestService } from '../../../core/services/pull_request/pull-request.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseEditService } from '../../../core/services/courses/course-edit.service';
import { CourseModal, ModalData } from "../../../shared/components/courseComponent/course-modal/course-modal";
import { ModuleCoursesService } from '../../../core/services/courses/module-courses.service';
import { UserOut } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-detail-course',
  imports: [CourseModule, CourseComments, Avatar, RouterModule, PullRequest, CommonModule, FormsModule, CourseModal, DragDropModule],
  templateUrl: './detail-course.html',
  styleUrl: './detail-course.css'
})
export class DetailCourse {
  courseService = inject(CoursesService);
  courseEdit = inject(CourseEditService);
  pullsService = inject(PullRequestService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastService = inject(ToastService);
  course?:Course;
  courseCopy?:CourseBase;
  detailService = inject(DetailCourses);
  moduleService = inject(ModuleCoursesService);
  loaderService = inject(LoaderService);
  authService = inject(AuthService);
  modules:ModuleCourseResponse[] = []
  courseRating:number=0;
  pulls:PullRequestBasicOut[]=[];
  selectedTab:string = "content-course";
  isEditMode: boolean = false;
  editingCourse: any = {};
  selectedCoverFile: File | null = null;
  previewImageUrl: string | null = null;
  isModalOpen: boolean = false;
  user: UserOut | null = null;
  isSavingOrder = false;

  onModalClose() {
    this.isModalOpen = false;
  }
  onModalSubmit(data: ModalData) {
    if (!this.course) {
      this.toastService.error('Curso no cargado');
      return;
    }

    this.loaderService.show();

    const moduleData = {
      id_course: this.course.id_course,
      name_module: data.title,
      description_module: data.description,
      status_module: true,
      order_index: this.modules.length + 1
    };

    this.moduleService.createModule(this.course.id_course, moduleData).subscribe({
      next: (newModule) => {
        this.isModalOpen = false;
        this.loaderService.hide();
        this.toastService.success('Módulo creado exitosamente');
        this.getModules(this.course!.id_course);
        console.log('Nuevo módulo:', newModule);
      },
      error: (err) => {
        this.loaderService.hide();
        console.log('Error al crear módulo:', err);
        this.toastService.error(err.error?.detail || 'Error al crear el módulo');
      }
    });
  }
  onAddModule() {
    console.log('Acción: Agregar publicación al módulo', this.course?.id_course);
    this.isModalOpen = true;
  }

   ratings = [
    { stars: 5, percent: 50 },
    { stars: 4, percent: 30 },
    { stars: 3, percent: 10 },
    { stars: 2, percent: 5 },
    { stars: 1, percent: 5 }
  ];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.loaderService.show();
      this.getCourseDetail(id);
      this.getModules(id);
      this.getPulls(id);
    });
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  getCourseDetail(id_course:number){
    this.courseService.getDetailCourse(id_course).subscribe({
      next:(data)=>{
        this.course=data;
        this.loaderService.hide();
      },
      error:(err)=>{
        this.loaderService.hide();}
    })
  }

  getModules(id_course:number){
    this.moduleService.getModules(id_course).subscribe({
      next:(data)=>{
        this.modules = [...data].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  onModuleDeleted(id_module:number){
    // Optimistic update to avoid showing stale data when the backend needs a moment
    this.modules = this.modules.filter(module => module.id_module !== id_module);

    // Refetch after a short delay to stay in sync once the delete is committed server-side
    if (this.course) {
      setTimeout(() => this.getModules(this.course!.id_course), 300);
    }
  }

  copyCourse(id_course:number){
    this.courseService.copyCourse(id_course).subscribe({
      next:(course) =>{
        this.toastService.success("Exito al copiar el curso "+course.name_course);
        this.router.navigate(['/course/detail/'+course.id_course]);
      }, error:(err)=>{
        console.log(err);
        this.toastService.error(err.error.detail);
      }
    })
  }
  changeSelectedTab(selected:string){
    this.selectedTab = selected;
  }

  getPulls(id_course:number){
    this.pullsService.getPulls(id_course).subscribe({
      next:(data)=>{
        console.log(data);
        this.pulls = data;
      },error:(err)=>{
      }
    })
  }

  enterEditMode(){
    console.log("hola")
    if(!this.course) return;
    this.isEditMode = true;
    this.toastService.show("Has entrado al modo edicion del curso " + this.course.name_course);
    this.editingCourse = {
      name_course: this.course.name_course,
      description_course: this.course.description_course,
      image: this.course.image
    };
    this.previewImageUrl = this.course.image || null;
  }

  cancelEditMode(){
    this.isEditMode = false;
    this.editingCourse = {};
    this.selectedCoverFile = null;
    this.previewImageUrl = null;
  }

  onCoverSelected(event: Event){
    const input = event.target as HTMLInputElement;
    if(input.files && input.files[0]){
      this.selectedCoverFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImageUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedCoverFile);
    }
  }

  saveCourseEdits(){
    if(!this.course) {
      this.toastService.error('Curso no cargado');
      return;
    }
    this.loaderService.show();
    
    this.courseEdit.updateCourseBasics(
      this.course.id_course,
      this.editingCourse.name_course,
      this.editingCourse.description_course,
      this.selectedCoverFile || undefined
    ).subscribe({
      next: (updatedCourse) => {
        if(this.course) {
          this.course = { ...this.course, ...updatedCourse };
        }
        this.isEditMode = false;
        this.selectedCoverFile = null;
        this.previewImageUrl = null;
        this.loaderService.hide();
        console.log(updatedCourse);
        this.toastService.success('Curso actualizado exitosamente');
      },
      error: (err) => {
        this.loaderService.hide();
        console.log(err);
        this.toastService.error(err.error?.detail || 'Error al actualizar el curso');
      }
    })
  }

  createModule(){
    if(!this.course?.is_my_course){
      this.toastService.show('Solo el creador puede agregar módulos');
      return;
    }
    this.toastService.show('Acción: Agregar módulo');
  }

  onDropModule(event: CdkDragDrop<ModuleCourseResponse[]>) {
    if (!this.isEditMode) return;
    moveItemInArray(this.modules, event.previousIndex, event.currentIndex);
    this.reindexModules();
    this.persistModuleOrder();
  }

  saveVersion() {
    if (!this.course) {
      this.toastService.error('Curso no cargado');
      return;
    }
    this.loaderService.show();
    this.courseService.saveVersion(this.course.id_course).subscribe({
      next: (response: any) => {
        this.loaderService.hide();
        this.toastService.success(`Versión ${response.version_number} guardada exitosamente`);
        console.log('Versión guardada:', response);
      },
      error: (err: any) => {
        this.loaderService.hide();
        console.log(err);
        this.toastService.error(err.error?.detail || 'Error al guardar la versión');
      }
    });
  }

  openPullRequest() {
    if (!this.course) {
      this.toastService.error('Curso no cargado');
      return;
    }
    this.router.navigate(['/pull-request/create', this.course.id_course]);
  }

  private reindexModules() {
    this.modules = this.modules.map((module, index) => ({
      ...module,
      order_index: index + 1
    }));
  }

  private persistModuleOrder() {
    if (!this.course) return;
    this.isSavingOrder = true;
    this.loaderService.show();

    const updates = this.modules.map(m =>
      ({ id_module: m.id_module, order_index: m.order_index })
    );

    this.moduleService.reorderModules(this.course.id_course, { modules: updates }).subscribe({
      next: () => {
        this.loaderService.hide();
        this.isSavingOrder = false;
        this.toastService.success('Orden de módulos actualizado');
      },
      error: (err) => {
        this.loaderService.hide();
        this.isSavingOrder = false;
        console.log(err);
        this.toastService.error(err.error?.detail || 'No se pudo actualizar el orden de los módulos');
      }
    });
  }
}
