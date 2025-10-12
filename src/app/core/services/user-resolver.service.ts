import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { UserOut } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<UserOut | null> {
  constructor(private authService: AuthService) {}

  resolve(): Observable<UserOut | null> {
    return this.authService.loadCurrentUser().pipe(
      catchError(() => of(null))
    );
  }


}
