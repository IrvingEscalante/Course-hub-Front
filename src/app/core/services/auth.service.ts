import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { API_ROUTES } from '../constants/api.routes';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginResponse, RegisterRequest, RegisterResponse, VerifyEmailPayload, MessageResponse } from '../models/auth.model';
import { UserOut, UserProfilePublic, UserProfilePrivate } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<UserOut | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // LOGIN
  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    
    const body = new HttpParams()
      .set('username', credentials.username)
      .set('password', credentials.password);

    return this.http.post<LoginResponse>(
      `${this.baseUrl}${API_ROUTES.auth.login}`,
      body.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    ).pipe(
      tap(res => {
        this.setToken(res.access_token);
        this.loadCurrentUser().subscribe();
      })
    );
  }

  //Registro

  register(user:RegisterRequest): Observable<RegisterResponse>{
    return this.http.post<RegisterResponse>(`${this.baseUrl}${API_ROUTES.auth.register}`, user);
  }

  verify_email(verify:VerifyEmailPayload):Observable<MessageResponse>{
    return this.http.post<MessageResponse>(`${this.baseUrl}${API_ROUTES.auth.verify_email}`, verify);
  }
  resend_code_verification(emailresend: string): Observable<MessageResponse> {
    const body = { email: emailresend };
    return this.http.post<MessageResponse>(
      `${this.baseUrl}${API_ROUTES.auth.resend_code}`, 
      body
    );
  }

  setToken(token: string) {
    if (this.isBrowser) localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  logout() {
    if (this.isBrowser) localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  // CARGAR USUARIO
  loadCurrentUser(): Observable<UserOut | null> {
    if (!this.getToken()) {
      this.currentUserSubject.next(null);
      return of(null);
    }
    return this.http.get<UserOut>(`${this.baseUrl}${API_ROUTES.users.my_data}`).pipe(
      tap(user => this.currentUserSubject.next(user)),
      catchError(() => {
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }

  getProfile(){
    return this.http.get<UserOut>(`${this.baseUrl}${API_ROUTES.users.my_data}`);
  }

  getUserProfile(username: string): Observable<UserProfilePublic | UserProfilePrivate>{
    return this.http.get<UserProfilePublic | UserProfilePrivate>(`${this.baseUrl}${API_ROUTES.users.profile}${username}`)
  } 

  get currentUserValue(): UserOut | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

}
