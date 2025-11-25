import { Component } from '@angular/core';
import { CourseList } from "../../shared/components/courseComponent/course-list/course-list";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserProfilePrivate, UserProfilePublic } from '../../core/models/user.model';
import { Course } from '../../core/models/course.model';
import { UserService } from '../../core/services/user/user.service';
import { Avatar } from "../../shared/components/avatar/avatar";

@Component({
  selector: 'app-profile-user',
  imports: [CourseList, RouterModule, Avatar],
  templateUrl: './profile-user.html',
  styleUrl: './profile-user.css'
})
export class ProfileUser {
  selectedTab: 'created' | 'favorites' = 'created'; // Valor inicial
  user !:UserProfilePrivate | UserProfilePublic;
  userExist : boolean = false;
  isMyProfile : boolean = false;
  avatarUrl : string = '';
  courses : Course[] = [];
  courses_favorites: Course[] = [];
  typeListCourses:string = "created"
  isFollowing:boolean = false;
  isLoading:boolean = true;
  

  selectTab(tab: 'created' | 'favorites') {
    console.log('Botón clickeado:', tab);
    this.selectedTab = tab;
  }

  constructor(private route:ActivatedRoute, private authService:AuthService, private userService:UserService){
    this.isMyProfile = false;
  }

  ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const username = params.get('username');
    if (username && username !== 'null') {
      this.authService.getUserProfile(username).subscribe({
        next: (userData) => {
          if ('id' in userData) {
          this.isMyProfile = true;
            this.user = userData as UserProfilePrivate;
          } else {
            this.user = userData as UserProfilePublic;
          }
          this.userExist = true;
          this.isLoading = false;
          this.isFollowing = userData.following;
          this.courses = userData.courses_create;
          this.courses_favorites = userData.courses_favorites;
        },
        error: (err) => {
          this.isLoading = false;
          console.log('Error al cargar usuario:', err.error.detail);
          if (err.error.detail === "Usuario no encontrado" ){
            this.userExist = false;
          }
        }
      });
    }
  });
}

activateCoursesFavorites(){}

followUnfollow(){
  this.userService.followUnfollow(this.user.username).subscribe({
    next:(res)=>{
      console.log(res)
      this.isFollowing = res.following
    },
    error:(err)=>{
      console.log(err)
    }
  })
}

}
