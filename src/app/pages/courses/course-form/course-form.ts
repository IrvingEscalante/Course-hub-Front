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
  title = 'Crear un nuevo curso';
  topics = ['Desarrollo', 'Diseño', 'Data', 'Marketing'];
  courseForm!: FormGroup;
  coverFile?: File;
  themes:ThemeResponse[] = [];
  coverPreview?: string | ArrayBuffer | null;
  publications: any[] = [];
  route = inject(ActivatedRoute);
  id:number=0;
  loading:boolean=false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      topic: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: ['', Validators.required]
    });
    this.getThemes();
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
    
    // Marcar campo de imagen como válido
    this.courseForm.get('image')?.setValue('selected');
  }

  removeCover(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.coverFile = undefined;
    this.coverPreview = null;
    // Marcar campo de imagen como inválido
    this.courseForm.get('image')?.setValue('');
  }

  changeCover(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    const input = document.querySelector('.image-input') as HTMLInputElement;
    input?.click();
  }

  // onFileSelected eliminado: ya no se usa getResources ni recursos

  // ---------- Submit ----------
  onSubmit() {
    if (this.courseForm.invalid) {
      this.loaderService.hide();
      this.courseForm.markAllAsTouched();
      this.toastService.error("Error no estan completos los datos del formulario");
      return;
    }
    
    if (!this.coverFile) {
      this.toastService.error("Debes seleccionar una imagen para el curso");
      return;
    }
    
    this.loaderService.show();
    this.loading = true;

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

    this.courseService.createCourse(fd).subscribe({
        next: (resp) => {
          this.loaderService.hide();
          this.toastService.success("El curso ha sido creado correctamente");
          this.router.navigate(['/course/detail/'+resp.course_id]);
          this.loading = false;
        },error: (err) => {
          this.loaderService.hide();
          this.toastService.error("Error al crear el curso");
          this.loading = false;
        }
    });
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