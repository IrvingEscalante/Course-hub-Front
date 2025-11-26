import { Component, inject, OnInit } from '@angular/core';
import { CourseList } from "../../shared/components/courseComponent/course-list/course-list";
import { CoursesService } from '../../core/services/courses/courses.service';
import { Course } from '../../core/models/course.model';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../core/services/loader';
@Component({
  selector: 'app-dashboard',
  imports: [CourseList, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  loading:boolean = true;
  filters = ['Todos', 'Populares', 'Nuevos', 'Tendencias'];
  selectedFilter = 'Todos';
  courses: Course[] = [];
  loaderService=inject(LoaderService)
  
  selectFilter(filter: string) {
    this.selectedFilter = filter;
  }
  
  constructor(private courseService: CoursesService){}

  ngOnInit(): void {
    this.fetchCourses();
    this.loaderService.show();

  }

  fetchCourses(){
    this.courseService.getCourses().subscribe({
      next:(courses)=>{
        this.courses = courses;
        this.loading=false;
        this.loaderService.hide();
      },
      error:(error)=>{
        console.log(error);
      },
      complete:()=>{
        this.loading = false;
      }
    });
  }
  searchTerm: string = '';

  onSearch() {
    this.loaderService.show();
    this.loading = true;

    this.courseService.getCourses(this.searchTerm).subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
        this.loaderService.hide();
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      }
    });
  }

}
