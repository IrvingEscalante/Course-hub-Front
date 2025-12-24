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

@Component({
  selector: 'app-detail-course',
  imports: [CourseModule, CourseComments, Avatar, RouterModule, PullRequest, CommonModule, FormsModule],
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
  loaderService = inject(LoaderService);
  modules:ModuleCourseResponse[] = []
  courseRating:number=0;
  pulls:PullRequestBasicOut[]=[];
  selectedTab:string = "content-course";
  isEditMode: boolean = false;
  editingCourse: any = {};
  selectedCoverFile: File | null = null;
  previewImageUrl: string | null = null;

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
  }

  getCourseDetail(id_course:number){
    this.courseService.getDetailCourse(id_course).subscribe({
      next:(data)=>{
        console.log(data)
        this.course=data;
        this.loaderService.hide();

      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

  getModules(id_course:number){
    this.detailService.getModules(id_course).subscribe({
      next:(data)=>{
        console.log("modules:"+data);
        this.modules = data;
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  getPublications(id_module:number){
    this.detailService.getPublications(id_module).subscribe({
      next:(data)=>{
        console.log(data);
      },
      error:(err)=>{
        console.log(err);
      }
    })
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
        console.log(err)
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
}
