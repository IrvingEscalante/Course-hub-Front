import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
    
  getAvatarUrl(name:string, photo:string=''): string {
    const firstLetter = name.charAt(0).toUpperCase() || '';
    return photo
          ? photo
          : `https://api.dicebear.com/9.x/initials/svg?seed=${firstLetter}`;
  }
}
