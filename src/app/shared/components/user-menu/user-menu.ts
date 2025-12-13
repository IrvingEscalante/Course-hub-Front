import { Component, Output,EventEmitter, Input, inject } from '@angular/core';
import { UserOut } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Avatar } from "../avatar/avatar";
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-user-menu',
  imports: [Avatar],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css'
})
export class UserMenu {
  @Output() close = new EventEmitter<void>();
  @Input() user!:UserOut;
  avatarUrl:string='';
  toastService=inject(ToastService);
  

  constructor(private authService:AuthService, private router:Router){}

  Profile(){
    this.close.emit();
    this.router.navigate(['/'+this.user.username]);
  }

  logout(){
    this.authService.logout();
    this.close.emit();
    this.toastService.success("Cesión cerrada correctamente");
    this.router.navigate(['/login']);
  }

}
