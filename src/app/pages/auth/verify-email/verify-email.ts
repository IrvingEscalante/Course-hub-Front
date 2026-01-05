import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { VerifyEmailPayload } from '../../../core/models/auth.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoaderService } from '../../../core/services/loader';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-verify-email',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css'
})
export class VerifyEmail {
  seconds: number = 0;
  intervalo: any;
  loaderService=inject(LoaderService);
  loading:boolean = false;
  loadingCode:boolean=false;
  verifyEmailForm!:FormGroup
  toastService=inject(ToastService);
  email:string = '';
  messageCode:string = '';
  constructor(private fb:FormBuilder, private authService:AuthService, private router:Router, private route:ActivatedRoute){
    this.verifyEmailForm = this.fb.group({
      emailverify:['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['token'];
    });
  }
  

   startCountdown() {
    this.seconds = 30; // reinicia a 30 cada vez que se inicia
    this.intervalo = setInterval(() => {
      this.seconds--;

      if (this.seconds <= 0) {
        clearInterval(this.intervalo);
        console.log("¡Tiempo terminado!");
      }
    }, 1000);
  }

  onSubmit(){
    this.loaderService.show();
    if (this.verifyEmailForm.valid){
      this.loading = true;
      const code = this.verifyEmailForm.value.emailverify;
      const payload:VerifyEmailPayload = {
        email : this.email!,
        code : code
      };
      this.authService.verify_email(payload).subscribe({
        next:(res)=>{
          this.loaderService.hide();
          this.toastService.success("Correo verificado correctamente, ya puedes iniciar sesión");
          this.router.navigate(['/login']);
        },
        error:(err) =>{
          this.loaderService.hide();
          if (err?.error.detail === "Codigo invalido o expirado"){
            this.messageCode = err?.error.detail;
          }
          this.loading = false;
        }
      })
    }else{
      console.log("no es valido");
    }
  }

  resendCode(){
    this.loaderService.show();
    this.loadingCode=true;
    if (this.email){
      console.log(this.email);
      this.authService.resend_code_verification(this.email).subscribe({
        next:(res) =>{
          this.loaderService.hide();
          this.loadingCode=false;
          this.startCountdown();
        },
        error:(error)=>{
          this.loaderService.hide();
          this.loadingCode=false;
          this.toastService.error(error.error.detail);
          console.log("Ocurrio un error", error);
        }
      })
    }
  }
  
}
