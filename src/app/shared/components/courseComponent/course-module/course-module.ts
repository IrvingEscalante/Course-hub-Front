import { Component } from '@angular/core';
import { CoursePublicationList } from '../course-publication-list/course-publication-list';

@Component({
  selector: 'app-course-module',
  imports: [CoursePublicationList],
  templateUrl: './course-module.html',
  styleUrl: './course-module.css'
})
export class CourseModule {
  isOpen:boolean = false;

  togglePublication(){

    this.isOpen = !this.isOpen;
  }
}
