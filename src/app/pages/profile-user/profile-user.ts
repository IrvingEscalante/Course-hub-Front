import { Component, inject } from '@angular/core';
import { CourseList } from "../../shared/components/courseComponent/course-list/course-list";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserFollow, UserOutFollow, UserProfilePrivate, UserProfilePublic } from '../../core/models/user.model';
import { Course } from '../../core/models/course.model';
import { UserService } from '../../core/services/user/user.service';
import { Avatar } from "../../shared/components/avatar/avatar";
import { LoaderService } from '../../core/services/loader';
import { FavoritesService } from '../../core/services/courses/favorites.service';
import { FollowService } from '../../core/services/follow/follow.service';
import { FollowerFollowingModal } from "../../shared/components/follower-following-modal/follower-following-modal";
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-profile-user',
  imports: [CourseList, RouterModule, Avatar, FollowerFollowingModal],
  templateUrl: './profile-user.html',
  styleUrl: './profile-user.css'
})
export class ProfileUser {
  selectedTab: 'created' | 'favorites' = 'created'; // Valor inicial
  user !:UserProfilePrivate | UserProfilePublic;
  favoritesService=inject(FavoritesService);
  userExist : boolean = false;
  showModal: boolean = false;
  modalTitle: string = "";
  followService = inject(FollowService);
  modalUsers: UserOutFollow[] = [];
  avatarUrl : string = '';
  courses : Course[] = [];
  courses_favorites: Course[] = [];
  typeListCourses:string = "created"
  isFollowing:boolean = false;
  loaderService=inject(LoaderService);
  toastService=inject(ToastService);
  auth=inject(AuthService);
  loading:boolean = true;
  userLogged!:string | null;
  username!:string | null;
  isModalLoading = false;
  isFollowingLoading: boolean = false;  

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


  getFollowers(){
    this.followService.getFollowers(this.user.username).subscribe({
      next: (data) => {
        this.modalUsers = data;
        this.isModalLoading = false;
      },
      error: (err) => {
        console.error("Error cargando seguidores", err);
        this.modalUsers = [];
      }
    });
  }
  
  getFollowing(){
    this.followService.getFollowing(this.user.username).subscribe({
      next: (data) => {
        console.log(data);
        this.modalUsers = data;
        this.isModalLoading = false;
      },
      error: (err) => {
        console.error("Error cargando seguidos", err);
        this.modalUsers = [];
      }
    });
  }
openFollowers() {
  this.modalTitle = "Seguidores";
  this.modalUsers = [];
  this.isModalLoading = true;
  this.showModal = true;
  this.getFollowers();
}

openFollowing() {
  this.modalTitle = "Siguiendo";
  this.modalUsers = [];  
  this.isModalLoading = true;
  this.showModal = true;
  this.getFollowing();
}


  getCoursesFavorites(username:string){
    this.favoritesService.getFavorites(username).subscribe({
      next:(data)=>{
        this.courses_favorites = data;
      },
      error:(err)=>{
        this.toastService.error("Error al obtener favoritos");
      }
    })
  }

  followUnfollow(){
    this.isFollowingLoading = true;
    this.userService.followUnfollow(this.user.username).subscribe({
      next:(res)=>{
        this.isFollowing = res.following
        if (res.following){
          this.toastService.success("Se ha empezado a seguir al usuario "+res.username);
        }else{
          this.toastService.success("Se ha dejado de seguir al usuario "+res.username);
        }
        this.isFollowingLoading = false;
      },
      error:(err)=>{
        this.isFollowingLoading = false;
        this.toastService.error(err.error.detail);
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
        console.log(userData);
        this.userExist = true;
        this.loading = false;
        this.loaderService.hide();
        this.isFollowing = userData.following;
        this.courses = userData.courses_create;
        this.courses_favorites = userData.courses_favorites;
      },
      error: (err) => {
        this.loading = false;
        console.log('Error al cargar usuario:', err.error.detail);
        if (err.error.detail === "Usuario no encontrado" ){
          this.userExist = false;
        }
      }
    });
  }
}
