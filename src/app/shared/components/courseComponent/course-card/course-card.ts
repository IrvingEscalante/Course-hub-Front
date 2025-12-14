import { Component, inject, Input } from '@angular/core';
import { Course } from '../../../../core/models/course.model';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user/user.service';
import { Avatar } from "../../avatar/avatar";
import { FavoritesService } from '../../../../core/services/courses/favorites.service';
import { ToastService } from '../../../../core/services/toast.service';


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
  toastService=inject(ToastService);
  
  constructor(private favoriteService:FavoritesService, private authservice:AuthService){}

  avatarUrl:string = '';

  ngOnChanges(): void {
    this.isFavorite = this.course!.is_my_favorite;
  }

  
  toggleFavorite(){
    if (!this.authservice.isLoggedIn()) {
      this.toastService.error("Inicia sesión primero para agregar a favoritos");
      return};
    this.isFavorite = !this.isFavorite;
    if (!this.course?.id_course) return
    this.favoriteService.addDeleteFavorites(this.course.id_course).subscribe({
      next:(res)=>{
        console.log(res);
        this.toastService.success(res.message);
      },
      error:(err)=>{
        console.log(err);
        this.toastService.error(err.detail);
      }
    })
  }
}
