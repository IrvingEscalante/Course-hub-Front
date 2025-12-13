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
  @Input() mode :'create' | 'edit' | 'copy' = 'create';
  @Input() course!: CourseFullResponse;

  title = 'Crear un nuevo curso';
  topics = ['Desarrollo', 'Diseño', 'Data', 'Marketing'];
  courseForm!: FormGroup;
  coverFile?: File;
  themes:ThemeResponse[] = [];
  coverPreview?: string | ArrayBuffer | null;
  publications: any[] = [];
  route = inject(ActivatedRoute);

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      topic: ['', Validators.required],
      description: ['', Validators.required],
      modules: this.fb.array([])
    });
    this.getThemes();
    if (id){
      console.log("esta editando");
      this.detailCourseService.getFulldataCourse(id).subscribe(res => {
        this.course = res;
        console.log(res);
        this.buildFormFromCourse(this.course);
      });
    }else{
      this.addModule();
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

  get modules(): FormArray {
    return this.courseForm.get('modules') as FormArray;
  }

  createModuleGroup(): FormGroup {
    return this.fb.group({
      title: [''],
      description: [''],
      publications: this.fb.array([])
    });
  }

  addModule() {
    this.modules.push(this.createModuleGroup());
  }

  removeModule(index: number) {
    this.modules.removeAt(index);
  }

  // ---------- Publications ----------
  getPublications(moduleIndex: number): FormArray {
    return this.modules.at(moduleIndex).get('publications') as FormArray;
  }

  createPublicationGroup(): FormGroup {
    return this.fb.group({
      title: [''],
      description: [''],
      resources: this.fb.array([])
    });
  }

  addPublication(moduleIndex: number) {
    this.getPublications(moduleIndex).push(this.createPublicationGroup());
  }

  removePublication(moduleIndex: number, pubIndex: number) {
    this.getPublications(moduleIndex).removeAt(pubIndex);
  }

  // ---------- Resources ----------
  getResources(moduleIndex: number, pubIndex: number): FormArray {
    return this.getPublications(moduleIndex).at(pubIndex).get('resources') as FormArray;
  }

  // resource: { type: 'image'|'video'|'pdf'|'pptx'|'note', value?: string, file?: File, fileName?: string }
  createResourceGroup(type: string): FormGroup {
    if (type === 'image' || type === 'archive') {
      return this.fb.group({
        type: [type],
        value: [null],
        file: [null],
        fileName: [''],
        preview: [null]
      });
    } else {
      // video (link) or note (text)
      return this.fb.group({
        type: [type],
        value: [''],
      });
    }
  }

  addResource(moduleIndex: number, pubIndex: number, type: string) {
    this.getResources(moduleIndex, pubIndex).push(this.createResourceGroup(type));
  }

  removeResource(moduleIndex: number, pubIndex: number, resIndex: number) {
    this.getResources(moduleIndex, pubIndex).removeAt(resIndex);
  }

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

  onFileSelected(event: Event, moduleIndex: number, pubIndex: number, resIndex: number) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    const resources = this.getResources(moduleIndex, pubIndex);
    const ctrl = resources.at(resIndex);
    // store file object (not serializable directly; use FormData on submit)
    ctrl.get('file')?.setValue(file);
    ctrl.get('fileName')?.setValue(file.name);

    // preview for images
    if ((ctrl.get('type')?.value) === 'image') {
      const reader = new FileReader();
      reader.onload = () => ctrl.get('preview')?.setValue(reader.result);
      reader.readAsDataURL(file);
    }
  }

  // ---------- Submit ----------
  onSubmit() {
    this.loaderService.show();
    if (this.courseForm.invalid) {
      console.log("incompleto");
      this.loaderService.hide();
      this.courseForm.markAllAsTouched();
      this.toastService.error("Error no estan completos los datos del formulario");
      return;
    }
    console.log("hola");

    const fd = new FormData();

    if (this.coverFile) {
      fd.append('cover', this.coverFile, this.coverFile.name);
    }

    const payload: CoursePayload = {
      title: this.courseForm.value.title,
      topic: this.courseForm.value.topic,
      description: this.courseForm.value.description,
      modules: []
    };

    this.modules.controls.forEach((modCtrl, mi) => {
      const modValue: ModulePayload = {
        title: modCtrl.value.title,
        description: modCtrl.value.description,
        publications: []
      };

      const pubs = modCtrl.get('publications') as FormArray;
      pubs.controls.forEach((pubCtrl, pi) => {
        const pubValue: PublicationPayload = {
          title: pubCtrl.value.title,
          description: pubCtrl.value.description,
          resources: []
        };

        const resources = pubCtrl.get('resources') as FormArray;
        resources.controls.forEach((resCtrl, ri) => {
          const r = resCtrl.value;

          if (r.type === 'image' || r.type === 'archive') {
            const fileKey = `file_m${mi}_p${pi}_r${ri}`;

            if (r.file) {
              fd.append(fileKey, r.file, r.file.name);
            }

            pubValue.resources.push({
              type: r.type,
              fileKey,
              fileName: r.fileName || null
            });
          } else {
            pubValue.resources.push({
              type: r.type,
              value: r.value
            });
          }
        });

        modValue.publications.push(pubValue);
      });

      payload.modules.push(modValue);
    });

    fd.append('payload', JSON.stringify(payload));
    console.log("PAYLOAD FINAL:", payload);
    console.log("FORMDATA ENTRIES:");
    for (let pair of fd.entries()) {
      console.log(pair[0], pair[1]);
    }

    this.courseService.createCourse(fd).subscribe({
      next: (resp) => {
        console.log("Curso creado:", resp);
        this.loaderService.hide();
        this.toastService.success("El curso ha sido creado correctamente");
        this.router.navigate(['/course/detail/'+resp.course_id]);
      },
      error: (err) => {
        console.log("Error al crear curso:", err);
        alert("Error al crear el curso");
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

  this.modules.clear(); // limpiar módulos previos

  course?.modules.forEach(m => {
    const modGroup = this.createModuleGroup();
    modGroup.patchValue({
      title: m.name_module,
      description: m.description_module
    });

    const pubsFA = modGroup.get('publications') as FormArray;

    m.course_publish.forEach(p => {
      const pubGroup = this.createPublicationGroup();
      pubGroup.patchValue({
        title: p.name_publication,
        description: p.description
      });

      const resFA = pubGroup.get('resources') as FormArray;

      p.content.forEach(r => {
        let type = r.type_content;
        if (type === 'text') type = 'note';
        if (type === 'pdf') type = 'archive'; // mapeo pdf -> archive

        const resGroup = this.createResourceGroup(type);

        if (type === 'image') {
          resGroup.patchValue({
            value: r.content ?? null,
            preview: r.content ?? null
          });
        } else if (type === 'archive') {
          const fileName = r.content?.split('/').pop() ?? '';
          resGroup.patchValue({
            fileName,
            value: r.content
          });
        } else {
          // video-embed o note
          resGroup.patchValue({
            value: r.content ?? ''
          });
        }

        resFA.push(resGroup);
      });

      pubsFA.push(pubGroup);
    });

    this.modules.push(modGroup);
  });
}
}