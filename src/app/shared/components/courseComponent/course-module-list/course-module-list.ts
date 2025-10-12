import { Component } from '@angular/core';
import { CourseModule } from '../course-module/course-module';

@Component({
  selector: 'app-course-module-list',
  imports: [CourseModule],
  templateUrl: './course-module-list.html',
  styleUrl: './course-module-list.css'
})
export class CourseModuleList {

}
