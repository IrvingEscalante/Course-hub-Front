import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-recover-password',
  imports: [ReactiveFormsModule],
  templateUrl: './recover-password.html',
  styleUrl: './recover-password.css'
})
export class RecoverPassword {
form: FormGroup;
  loading = false;
  authService=inject(AuthService);
  toastService=inject(ToastService);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.form.get('email')!;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const email = this.form.value.email;

    console.log('Enviar recuperación a:', email);

    this.authService.recover_password(email).subscribe({
      next:(resp)=>{
        this.toastService.success(resp.message);
      },error:(error)=>{
        this.toastService.error(error.error.message || 'Error al enviar el correo de recuperación');
      }
    });

    setTimeout(() => {
      this.loading = false;
      // feedback visual / redirect
    }, 1000);
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
