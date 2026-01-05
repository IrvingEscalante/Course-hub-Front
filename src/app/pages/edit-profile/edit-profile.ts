import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserOut } from '../../core/models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Avatar } from "../../shared/components/avatar/avatar";
import { UserService } from '../../core/services/user/user.service';
import { ToastService } from '../../core/services/toast.service';
import { Router} from '@angular/router';
import { LoaderService } from '../../core/services/loader';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, Avatar],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile {
  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  location = inject(Location);
  loaderService = inject(LoaderService);
  toastService = inject(ToastService);
  profileForm!: FormGroup;
  user:UserOut | null = null;
  previewImage: string | null = null;
  selectedFile: File | null = null;
  isrendering:boolean = false;
  loadingedit:boolean = false;
  constructor(private fb: FormBuilder) {}
  validatePassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_!@#$%^&*\-])[A-Za-z\d_!@#$%^&*\-]{8,}$/

  ngOnInit(): void {

    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_-]+$/)]],
      biography: ['', Validators.maxLength(500)],
      passwords: this.fb.group({currentPassword: [''],newPassword: ['', [Validators.pattern(this.validatePassword)]],confirmPassword: ['']}, { validators: this.passwordMatchValidator })
    });

    this.getProfile();
  }

  getProfile(){
    this.authService.getProfile().subscribe({
      next:(user)=>{
        this.user = user;
        this.isrendering = true;
        this.profileForm.patchValue({
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          username: user.username,
          biography: user.biography ?? ''
        });
      },error:(err)=>{
        console.log(err);
      }
    })
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (!newPassword && !confirmPassword) return null;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }


onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) return;

  this.selectedFile = input.files[0];

  this.previewImage = URL.createObjectURL(this.selectedFile);

  if (this.user) {
    this.user = {
      ...this.user,
      photo: this.previewImage
    };
  }
}

  onSubmit(): void {
    if (this.profileForm.invalid) return;
    this.loaderService.show();
    this.loadingedit = true;
    const formValue = this.profileForm.value;

    const payload: any = {
      name: formValue.name,
      lastname: formValue.lastname,
      email: formValue.email,
      username: formValue.username,
      biography: formValue.biography
    };

    if (formValue.passwords.newPassword) {
      payload.currentPassword = formValue.passwords.currentPassword;
      payload.newPassword = formValue.passwords.newPassword;
    }

    if (this.selectedFile) {
      payload.avatar = this.selectedFile;
    }
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value as any);
      }
    });
    this.userService.editProfile(formData).subscribe({
      next:(data)=>{
        this.loaderService.hide();
        this.loadingedit = false;
        this.toastService.success("Se ha editado su perfil correctamente");
        this.router.navigate(['/'+data.username]);
      },error:(err)=>{
        this.toastService.error(err.error.detail);
        this.loaderService.hide();
        this.loadingedit = false;
        console.log(err);
      }
    })
    console.log('Payload listo para backend:', payload);
  }

  goBack(): void {
    this.location.back();
  }
}
