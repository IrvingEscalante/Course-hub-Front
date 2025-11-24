import { Component, inject, Input } from '@angular/core';
import { CoursePublicationList } from '../course-publication-list/course-publication-list';
import { CoursePublishResponse, ModuleCourseResponse } from '../../../../core/models/detail_course.model';
import { DetailCourses } from '../../../../core/services/courses/detail-courses.service';
import { CoursePublication } from "../course-publication/course-publication";

@Component({
  selector: 'app-course-module',
  imports: [CoursePublication],
  templateUrl: './course-module.html',
  styleUrl: './course-module.css'
})
export class CourseModule {
  isOpen:boolean = false;
  detailService=inject(DetailCourses);
  @Input() moduleCourse!:ModuleCourseResponse;
  publications: CoursePublishResponse[] = [];
  togglePublication(){

    this.isOpen = !this.isOpen;
  }

  ngOnInit(){
    this.getPublications(this.moduleCourse.id_module);
  }

  getPublications(id_module:number){
    this.detailService.getPublications(id_module).subscribe({
      next:(data)=>{
        console.log("publis:", data);
        this.publications = data;
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
