import { Component, Input } from '@angular/core';
import { Course } from '../../../../core/models/course.model';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';


@Component({
  selector: 'app-course-card',
  imports: [RouterModule],
  templateUrl: './course-card.html',
  styleUrl: './course-card.css'
})
export class CourseCard {
  @Input() course?:Course;
  
  isFavorite: boolean = false;
  constructor(private authService:AuthService){}

  avatarUrl:string = '';

  ngOnInit():void{
    this.avatarUrl = this.authService.getAvatarUrl(String(this.course?.user.username), this.course?.user.photo);
  }
  toggleFavorite(){
    this.isFavorite = !this.isFavorite;
  }
}
