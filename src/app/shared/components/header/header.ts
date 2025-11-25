import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserOut } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { AvatarModule } from 'ngx-avatars';
import { UserMenu } from '../user-menu/user-menu';
import { UserService } from '../../../core/services/user/user.service';
import { Avatar } from "../avatar/avatar";

@Component({
  selector: 'app-header',
  imports: [RouterModule, AvatarModule, UserMenu, Avatar],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  user: UserOut | null = null;
  showMenu : boolean = false;
  currentUrl: string = '';
  avatarUrl:string = '';
  userLoaded:boolean = false;
  userService = inject(UserService);
  constructor(private authService: AuthService, public router:Router) {
    
  }
  loading: boolean = true;
  

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.loading = false;
      
      if (this.user){this.userLoaded = true}
    });
  }

  toggleMenu(){
    this.showMenu = !this.showMenu;
  }

  closeMenu(){
    this.showMenu = false;
  }

}
