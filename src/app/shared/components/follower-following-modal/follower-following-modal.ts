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
  @Output() closed = new EventEmitter<void>();
  isFollowing:boolean = false
  close() {
    this.closed.emit();
  }
  ngOnInit(){
    console.log(this.users);
  }
  userService = inject(UserService)
    followUnfollow(user:string){
    this.userService.followUnfollow(user).subscribe({
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
