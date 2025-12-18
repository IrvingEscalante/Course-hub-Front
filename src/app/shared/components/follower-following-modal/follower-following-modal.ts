import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { Avatar } from "../avatar/avatar";
import { UserOut, UserOutFollow} from '../../../core/models/user.model';
import { RouterLink, RouterModule } from "@angular/router";

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
  close() {
    this.closed.emit();
  }
  ngOnInit(){
    console.log(this.users);
  }
  userService = inject(UserService)
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

}
