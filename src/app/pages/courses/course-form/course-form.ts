import { Component, inject, Input } from '@angular/core';
import { Course } from '../../../core/models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { CoursesService } from '../../../core/services/courses/courses.service';
import { ThemeResponse } from '../../../core/models/theme.model';
import { LoaderService } from '../../../core/services/loader';
import { CourseFullResponse, CoursePublishResponse } from '../../../core/models/detail_course.model';
import { DetailCourses } from '../../../core/services/courses/detail-courses.service';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-course-form',
  imports: [ReactiveFormsModule],
  templateUrl: './course-form.html',
  styleUrl: './course-form.css'
})
export class CourseForm {
  courseService=inject(CoursesService);
  detailCourseService=inject(DetailCourses);
  loaderService=inject(LoaderService);
  toastService=inject(ToastService);
  router=inject(Router);
  apiurlforStatics = environment.apiUrlForStatics;
  @Input() mode :'create' | 'edit' = 'create';
  @Input() course!: CourseFullResponse;

  title = 'Crear un nuevo curso';
  topics = ['Desarrollo', 'Diseño', 'Data', 'Marketing'];
  courseForm!: FormGroup;
  coverFile?: File;
  themes:ThemeResponse[] = [];
  coverPreview?: string | ArrayBuffer | null;
  publications: any[] = [];
  route = inject(ActivatedRoute);
  id:number=0;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      topic: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.getThemes();
    if (this.id){
      this.mode = "edit";
      this.title = "Editar curso";
      this.detailCourseService.getFulldataCourse(this.id).subscribe(res => {
        this.course = res;
        this.buildFormFromCourse(this.course);
      });
    }
  }

  getThemes(){
    this.courseService.getThemes().subscribe({
      next:(data)=>{
        console.log(data);
        this.themes = data;
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  // Métodos de módulos, publicaciones y recursos eliminados

  // ---------- File handling ----------
  onCoverSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.coverFile = file;

    // preview
    const reader = new FileReader();
    reader.onload = () => this.coverPreview = reader.result;
    reader.readAsDataURL(file);
  }

  // onFileSelected eliminado: ya no se usa getResources ni recursos

  // ---------- Submit ----------
  onSubmit() {
    this.loaderService.show();
    if (this.courseForm.invalid) {
      this.loaderService.hide();
      this.courseForm.markAllAsTouched();
      this.toastService.error("Error no estan completos los datos del formulario");
      return;
    }

    const fd = new FormData();
    if (this.coverFile) {
      fd.append('cover', this.coverFile, this.coverFile.name);
    }

    const payload = {
      title: this.courseForm.value.title,
      topic: this.courseForm.value.topic,
      description: this.courseForm.value.description
    };
    fd.append('payload', JSON.stringify(payload));

    if (this.mode == 'create'){
      this.courseService.createCourse(fd).subscribe({
        next: (resp) => {
          this.loaderService.hide();
          this.toastService.success("El curso ha sido creado correctamente");
          this.router.navigate(['/course/detail/'+resp.course_id]);
        },
        error: (err) => {
          this.loaderService.hide();
          this.toastService.error("Error al crear el curso");
        }
      });
    }else if(this.mode=='edit'){
      this.courseService.editCourse(this.id,fd).subscribe({
        next:(data)=>{
          this.loaderService.hide();
          this.toastService.success("El curso ha sido editado correctamente");
          this.router.navigate(['/course/detail/'+this.id]);
        },error:(err)=>{
          this.loaderService.hide();
          this.toastService.error("Error al editar el curso");
        }
      })
    }
  }

buildFormFromCourse(course: CourseFullResponse) {
  if (course.image) {
    this.coverPreview = course.image;
  }
  this.courseForm.patchValue({
    title: course.name_course,
    topic: course.id_theme,
    description: course.description_course
  });
}
}