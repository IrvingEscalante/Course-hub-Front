import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { Avatar } from "../avatar/avatar";
import { UserOut, UserOutFollow} from '../../../core/models/user.model';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-follower-following-modal',
  imports: [Avatar, RouterModule],
  templateUrl: './follower-following-modal.html',
  styleUrl: './follower-following-modal.css'
})
export class FollowerFollowingModal {
  @Input() title: string = 'Seguidores';
  @Input() users: UserOutFollow[] = [];
  @Input() loading = false;
  @Output() closed = new EventEmitter<void>();
  user: UserOut | null = null;
  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }
  close() {
    this.closed.emit();
  }
  
  followUnfollow(user: UserOutFollow) {
    this.userService.followUnfollow(user.username).subscribe({
      next: (res) => {
        user.is_following = res.following;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  goToUserProfile(username:string){
    this.router.navigate(['/'+username]);
    this.closed.emit();
  }

}
