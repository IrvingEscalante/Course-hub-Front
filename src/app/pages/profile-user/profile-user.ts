import { Component, inject } from '@angular/core';
import { CourseList } from "../../shared/components/courseComponent/course-list/course-list";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserProfilePrivate, UserProfilePublic } from '../../core/models/user.model';
import { Course } from '../../core/models/course.model';
import { UserService } from '../../core/services/user/user.service';
import { Avatar } from "../../shared/components/avatar/avatar";
import { LoaderService } from '../../core/services/loader';
import { FavoritesService } from '../../core/services/courses/favorites.service';

@Component({
  selector: 'app-profile-user',
  imports: [CourseList, RouterModule, Avatar],
  templateUrl: './profile-user.html',
  styleUrl: './profile-user.css'
})
export class ProfileUser {
  selectedTab: 'created' | 'favorites' = 'created'; // Valor inicial
  user !:UserProfilePrivate | UserProfilePublic;
  favoritesService=inject(FavoritesService);
  userExist : boolean = false;

  avatarUrl : string = '';
  courses : Course[] = [];
  courses_favorites: Course[] = [];
  typeListCourses:string = "created"
  isFollowing:boolean = false;
  loaderService=inject(LoaderService);
  auth=inject(AuthService);
  isLoading:boolean = true;
  userLogged!:string | null;
  username!:string | null;

  selectTab(tab: 'created' | 'favorites') {
    this.getCoursesFavorites(this.user.username);
    this.selectedTab = tab;
  }

  constructor(private route:ActivatedRoute, private authService:AuthService, private userService:UserService){}

  ngOnInit(): void {
  this.loaderService.show();
  this.route.paramMap.subscribe(params => {
    this.username = params.get('username');
    this.userLogged = this.auth.currentUserValue?.username ?? null;
    if (this.username && this.username !== 'null') {
      this.getUserProfile(this.username);
      this.getCoursesFavorites(this.username);
    }
      
  });
}

  isOwner(): boolean {
    return this.userLogged === this.username;
  }


  getCoursesFavorites(username:string){
    this.favoritesService.getFavorites(username).subscribe({
      next:(data)=>{
        console.log("favs", data);
        this.courses_favorites = data;
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

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

  getUserProfile(username:string){
    this.authService.getUserProfile(username).subscribe({
      next: (userData) => {
        if ('id' in userData) {
          this.user = userData as UserProfilePrivate;
        } else {
          this.user = userData as UserProfilePublic;
        }
        this.userExist = true;
        this.isLoading = false;
        this.loaderService.hide();
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
}
