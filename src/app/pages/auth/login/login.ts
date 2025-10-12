import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  loading:boolean = false;
  messageLogin: string = '';

  constructor(private fb: FormBuilder, private router: Router, private auth_service:AuthService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

   onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.auth_service.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.auth_service.setToken(response.access_token);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error en login:', err.error.detail);
          this.loading = false;
          this.messageLogin = err.error.detail;
        },
        complete: () => {
          console.log('Observable completado');
        }
      });
    }
  }
}
