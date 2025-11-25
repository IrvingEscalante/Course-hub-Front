import { Component, Input } from '@angular/core';
import { Course } from '../../../../core/models/course.model';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user/user.service';
import { Avatar } from "../../avatar/avatar";


@Component({
  selector: 'app-course-card',
  imports: [RouterModule, Avatar],
  templateUrl: './course-card.html',
  styleUrl: './course-card.css'
})
export class CourseCard {
  @Input() course?:Course;
  @Input() favoriteIds: number[] = [];
  @Input() isFavorite: boolean = false;
  
  constructor(private userService:UserService, private authservice:AuthService){}

  avatarUrl:string = '';

  ngOnChanges(): void {
    this.isFavorite = this.course!.is_my_favorite;
  }

  
  toggleFavorite(){
    if (!this.authservice.isLoggedIn()) return;
    this.isFavorite = !this.isFavorite;
    if (!this.course?.id_course) return
    this.userService.addDeleteFavorites(this.course.id_course).subscribe({
      next:(res)=>{
        console.log(res);
         
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
