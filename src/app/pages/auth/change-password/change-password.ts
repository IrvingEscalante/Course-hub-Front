import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePassword implements OnInit {
  changePasswordForm!: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  toastService = inject(ToastService);
  token: string = '';

  ngOnInit(): void {
    this.initializeForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  initializeForm(): void {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const new_password = this.changePasswordForm.get('password')?.value;
      this.authService.change_password({ token: this.token, new_password }).subscribe({
        next: (response) => {
          this.toastService.success(response.message);
          console.log('Contraseña cambiada exitosamente:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error al cambiar la contraseña:', error);
        }
      });
    }
  }
}
