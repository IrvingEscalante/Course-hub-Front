import { Component, Input } from '@angular/core';
import { Course } from '../../../core/models/course.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-form',
  imports: [],
  templateUrl: './course-form.html',
  styleUrl: './course-form.css'
})
export class CourseForm {
  @Input() mode :'create' | 'edit' | 'copy' = 'create';
  @Input() course?: Course;

  title:string = '';
  id?: number;

  constructor(private route:ActivatedRoute){}

  ngOnInit() {
  const path = this.route.snapshot.routeConfig?.path;
  console.log("path",path)

  if (path?.startsWith('create')) this.mode = 'create';
  else if (path?.startsWith('edit')) this.mode = 'edit';
  else this.mode = 'copy';

  this.id = Number(this.route.snapshot.paramMap.get('id'));
  this.setTitle();
}
  setTitle() {
    switch (this.mode) {
      case 'create':
        this.title = 'Crear nuevo curso';
        break;
      case 'edit':
        this.title = `Editar curso #${this.id}`;
        break;
      case 'copy':
        this.title = `Copiar curso #${this.id}`;
        break;
      default:
        this.title = 'Gestión de curso';
    }
  }

  loadCourseData(course: Course) {
    // cargar datos en el formulario
  }
  save() {
    if (this.mode === 'create') {
      // llamada a servicio createCourse()
    } else if (this.mode === 'edit') {
      // llamada a servicio updateCourse()
    } else {
      // llamada a servicio copyCourse()
    }
  }

}
