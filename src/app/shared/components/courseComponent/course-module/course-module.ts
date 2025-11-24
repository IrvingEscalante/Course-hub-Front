import { Component, inject, Input } from '@angular/core';
import { CoursePublishResponse, ModuleCourseResponse } from '../../../../core/models/detail_course.model';
import { DetailCourses } from '../../../../core/services/courses/detail-courses.service';
import { CoursePublication } from "../course-publication/course-publication";
import { SafeUrlPipe } from '../../../pipes/safeurlpipe-pipe';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-course-module',
  imports: [CoursePublication, SafeUrlPipe],
  templateUrl: './course-module.html',
  styleUrl: './course-module.css'
})
export class CourseModule {
  isOpen:boolean = false;
  detailService=inject(DetailCourses);
  @Input() moduleCourse!:ModuleCourseResponse;
  publications: CoursePublishResponse[] = [];
  hasLoaded: boolean = false;
  pdfModalUrl?: string;

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
}
