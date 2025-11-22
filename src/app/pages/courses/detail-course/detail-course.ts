import { Component, inject } from '@angular/core';
import { CourseModuleList } from '../../../shared/components/courseComponent/course-module-list/course-module-list';
import { CourseComments } from "../../../shared/components/courseComponent/course-comments/course-comments";
import { CoursesService } from '../../../core/services/courses/courses.service';
import { Course } from '../../../core/models/course.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-course',
  imports: [CourseModuleList, CourseComments],
  templateUrl: './detail-course.html',
  styleUrl: './detail-course.css'
})
export class DetailCourse {
  courseService = inject(CoursesService)
  route = inject(ActivatedRoute)
  course?:Course;

   ratings = [
    { stars: 5, percent: 50 },
    { stars: 4, percent: 30 },
    { stars: 3, percent: 10 },
    { stars: 2, percent: 5 },
    { stars: 1, percent: 5 }
  ];

  ngOnInit(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getCourseDetail(id);
  }

  getCourseDetail(id_course:number){
    this.courseService.getDetailCourse(id_course).subscribe({
      next:(data)=>{
        console.log(data)
        this.course=data;
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
}
