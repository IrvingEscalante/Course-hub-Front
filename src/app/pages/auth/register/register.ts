import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { __param } from 'tslib';
import { LoaderService } from '../../../core/services/loader';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  loaderService=inject(LoaderService);
    registerForm!:FormGroup;
    loading:boolean = false;
    router=inject(Router);
    messageEmail:string = '';
    messageUser:string = '';
    showPassword = false;
    showPasswordConfirm = false;
    validatorNames = /^([A-Za-zÁÉÍÓÚáéíóúÑñ]{2,50})(\s[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,50})*$/;

    validateUser = /^[a-zA-Z0-9]{2,30}$/

    // Contraseña segura: mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial
    validatePassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_!@#$%^&*\-])[A-Za-z\d_!@#$%^&*\-]{8,}$/

    constructor(private fb: FormBuilder, private authService:AuthService) {
    this.registerForm = this.fb.group({
      name: ['',[Validators.required, Validators.pattern(this.validatorNames)]],
      lastname: ['', [Validators.required, Validators.pattern(this.validatorNames)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.pattern(this.validateUser)]],
      password: ['', [Validators.required, Validators.pattern(this.validatePassword)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordConfirm() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  passwordMatchValidator(formGroup: AbstractControl) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(){
    this.loaderService.show();
    if (this.registerForm.valid){
        this.loading = true;
        console.log("datos del registro: ", this.registerForm.value)
        const {confirmPassword, ...userData} = this.registerForm.value;
        this.authService.register(userData).subscribe({
          next:(res)=>{
            this.loaderService.hide();
            this.router.navigate(
              ['/verify-email'],
              { queryParams: { token: res.token_verification } }
            );
          },
          error: (err) =>{
            this.loading = false;
            this.loaderService.hide();
            if(err.error.detail == "El usuario ya está registrado"){
              this.messageUser = "Este nombre de usuario ya está registrado, por favor ingresa otro.";
            }else if (err.error.detail == "El correo ya está registrado"){
              this.messageEmail = "Este correo ya está registrado, por favor ingresa otro.";
            }
          }
        })
    }else{}
  }
}
