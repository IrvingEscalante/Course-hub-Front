import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Storageservice {
  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
}
