import { Component, Input } from '@angular/core';
import { CoursePublicationList } from '../course-publication-list/course-publication-list';
import { ModuleCourseResponse } from '../../../../core/models/detail_course.model';

@Component({
  selector: 'app-course-module',
  imports: [CoursePublicationList],
  templateUrl: './course-module.html',
  styleUrl: './course-module.css'
})
export class CourseModule {
  isOpen:boolean = false;
  @Input() moduleCourse!:ModuleCourseResponse;
  togglePublication(){

    this.isOpen = !this.isOpen;
  }
}
