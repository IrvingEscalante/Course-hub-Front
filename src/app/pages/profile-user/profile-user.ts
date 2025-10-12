import { Component } from '@angular/core';
import { CourseList } from "../../shared/components/courseComponent/course-list/course-list";
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserProfilePrivate, UserProfilePublic } from '../../core/models/user.model';
import { Course } from '../../core/models/course.model';

@Component({
  selector: 'app-profile-user',
  imports: [CourseList],
  templateUrl: './profile-user.html',
  styleUrl: './profile-user.css'
})
export class ProfileUser {
  selectedTab: 'creados' | 'favoritos' = 'creados'; // Valor inicial
  user !:UserProfilePrivate | UserProfilePublic;
  userExist : boolean = false;
  isMyProfile : boolean = false;
  avatarUrl : string = '';
  courses : Course[] = []

  selectTab(tab: 'creados' | 'favoritos') {
    console.log('Botón clickeado:', tab);
    this.selectedTab = tab;
  }

  constructor(private route:ActivatedRoute, private authService:AuthService){
    this.isMyProfile = false;
  }

  ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const username = params.get('username');
    if (username && username !== 'null') {
      this.authService.getUserProfile(username).subscribe({
        next: (userData) => {
          console.log(userData);
          if ('id' in userData) {
          this.isMyProfile = true;
            this.user = userData as UserProfilePrivate;
          } else {
            this.user = userData as UserProfilePublic;
          }
          this.userExist = true;
          this.avatarUrl = this.authService.getAvatarUrl(String(userData.name), userData.photo || '');
          this.courses = userData.courses;
        },
        error: (err) => {
          console.log('Error al cargar usuario:', err.error.detail);
          if (err.error.detail === "Usuario no encontrado" ){
            this.userExist = false;
          }
        }
      });
    }
  });
}

}
