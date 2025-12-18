import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserOut } from '../../core/models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Avatar } from "../../shared/components/avatar/avatar";

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, Avatar],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile {
  authService = inject(AuthService);
  profileForm!: FormGroup;
  user:UserOut | null = null;
  previewImage: string | null = null;
  selectedFile: File | null = null;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {

    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      biography: [''],
      passwords: this.fb.group({
        currentPassword: [''],
        newPassword: [''],
        confirmPassword: ['']
      })
    });

    this.getProfile();
  }

  getProfile(){
    this.authService.getProfile().subscribe({
      next:(user)=>{
        this.user = user;
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

    const formValue = this.profileForm.value;

    const payload: any = {
      name: formValue.name,
      lastname: formValue.lastname,
      email: formValue.email,
      username: formValue.username,
      biography: formValue.biography
    };

    // Enviar contraseña SOLO si el usuario la quiere cambiar
    if (formValue.passwords.newPassword) {
      payload.currentPassword = formValue.passwords.currentPassword;
      payload.newPassword = formValue.passwords.newPassword;
    }

    // Imagen
    if (this.selectedFile) {
      payload.avatar = this.selectedFile;
    }

    console.log('Payload listo para backend:', payload);
  }
}
