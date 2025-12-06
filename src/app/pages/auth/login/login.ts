import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoaderService } from '../../../core/services/loader';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  toastr = inject (ToastrService);
  loginForm: FormGroup;
  loading:boolean = false;
  messageLogin: string = '';
  loaderService=inject(LoaderService);
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  constructor(private fb: FormBuilder, private router: Router, private auth_service:AuthService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

   onSubmit() {
    this.loaderService.show();
    if (this.loginForm.valid) {
      this.loading = true;
      this.auth_service.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.auth_service.setToken(response.access_token);
          this.router.navigate(['/']);
          this.toastr.success("Login exitoso");
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
