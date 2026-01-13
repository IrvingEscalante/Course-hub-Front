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
    this.fetchCourses();
  }
  
  constructor(private courseService: CoursesService){}

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(){
    this.loading = true;
    const typeQuery = this.filterTypeMap[this.selectedFilter] || 'all';
    
    this.courseService.getCourses(this.searchTerm || undefined, typeQuery).subscribe({
      next:(courses)=>{
        this.courses = courses;
        this.loading=false;
      },
      error:(error)=>{
        this.toastService.error(error.error.detail);
        this.loading = false;
      },
      complete:()=>{
        this.loading = false;
      }
    });
  }
  searchTerm: string = '';

  onSearch() {
    this.loading = true;
    const typeQuery = this.filterTypeMap[this.selectedFilter] || 'all';

    this.courseService.getCourses(this.searchTerm || undefined, typeQuery).subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      }
    });
  }
  getCoursePages(): Course[][] {
    const pageSize = 10;
    const pages: Course[][] = [];
    for (let i = 0; i < this.courses.length; i += pageSize) {
      pages.push(this.courses.slice(i, i + pageSize));
    }
    return pages;
  }

}
