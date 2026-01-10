import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoaderService } from '../../../core/services/loader';

@Component({
  selector: 'app-recover-password',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './recover-password.html',
  styleUrl: './recover-password.css'
})
export class RecoverPassword {
form: FormGroup;
  loading = false;
  authService=inject(AuthService);
  toastService=inject(ToastService);
  loaderService=inject(LoaderService);

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
    this.loaderService.show();
    this.loading = true;
    const email = this.form.value.email;
    this.authService.recover_password(email).subscribe({
      next:(resp)=>{
        this.toastService.success(resp.message);
        this.loading = false;
        this.loaderService.hide();
        this.router.navigate(['/login']);
      },error:(error)=>{
        this.toastService.error(error.error.detail || 'Error al enviar el correo de recuperación');
        this.loading = false;
        this.loaderService.hide();
      }
    });
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
