import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  imports: [ReactiveFormsModule],
  templateUrl: './recover-password.html',
  styleUrl: './recover-password.css'
})
export class RecoverPassword {
form: FormGroup;
  loading = false;

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

    // 👉 aquí llamas a tu servicio
    // this.authService.recoverPassword(email).subscribe(...)

    setTimeout(() => {
      this.loading = false;
      // feedback visual / redirect
    }, 1000);
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
