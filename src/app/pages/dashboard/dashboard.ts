import { Component, inject, OnInit } from '@angular/core';
import { CourseList } from "../../shared/components/courseComponent/course-list/course-list";
import { CoursesService } from '../../core/services/courses/courses.service';
import { Course } from '../../core/models/course.model';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../core/services/loader';
import { ToastService } from '../../core/services/toast.service';
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
  toastService = inject(ToastService);
  
  // Mapeo de filtros a parámetros de query
  filterTypeMap: { [key: string]: 'all' | 'new' | 'popular' | 'trending' } = {
    'Todos': 'all',
    'Populares': 'popular',
    'Nuevos': 'new',
    'Tendencias': 'trending'
  };
  
  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.loading = true;
    this.loaderService.show();
    this.fetchCourses();
  }
  
  constructor(private courseService: CoursesService){}

  ngOnInit(): void {
    this.fetchCourses();
    this.loaderService.show();

  }

  fetchCourses(){
    this.loading = true;
    const typeQuery = this.filterTypeMap[this.selectedFilter] || 'all';
    
    this.courseService.getCourses(this.searchTerm || undefined, typeQuery).subscribe({
      next:(courses)=>{
        this.courses = courses;
        this.loading=false;
        this.loaderService.hide();
      },
      error:(error)=>{
        this.toastService.error(error.error.detail);
        this.loading = false;
        this.loaderService.hide();
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
    const typeQuery = this.filterTypeMap[this.selectedFilter] || 'all';

    this.courseService.getCourses(this.searchTerm || undefined, typeQuery).subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
        this.loaderService.hide();
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
        this.loaderService.hide();
      }
    });
  }

}
