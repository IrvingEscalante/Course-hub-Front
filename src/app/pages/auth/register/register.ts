import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registerForm!:FormGroup;
    loading:boolean = false;
    messageEmail:string = '';
    messageUser:string = '';
    validatorNames = /^([A-Za-zÁÉÍÓÚáéíóúÑñ]{2,50})(\s[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,50})*$/;
    validateUser = /^[a-zA-Z0-9]{2,30}$/
    constructor(private fb: FormBuilder, private router:Router, private authService:AuthService) {
    this.registerForm = this.fb.group({
      name: ['',[Validators.required, Validators.pattern(this.validatorNames)]],
      lastname: ['', [Validators.required, Validators.pattern(this.validatorNames)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.pattern(this.validateUser)]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: AbstractControl) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(){
    if (this.registerForm.valid){
        this.messageEmail = '';
        this.messageUser = '';
        this.loading = true;
        console.log("datos del registro: ", this.registerForm.value)
        const {confirmPassword, ...userData} = this.registerForm.value;
        this.authService.register(userData).subscribe({
          next:(res)=>{
            console.log("Se envio el correo");
          },
          error: (err) =>{
            this.loading = false;
            console.log("Error al registrar", err.error.detail)
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
