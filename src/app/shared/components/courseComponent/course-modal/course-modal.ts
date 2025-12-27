import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

export type ActionType = 'add' | 'edit';
export type ElementType = 'module' | 'publication' | 'content';

export interface ModalData {
  title: string;
  description: string;
  file?: File;
}

@Component({
  selector: 'app-course-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-modal.html',
  styleUrl: './course-modal.css'
})
export class CourseModal implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() actionType: ActionType = 'add';
  @Input() elementType: ElementType = 'module';
  @Input() initialData?: ModalData;
  
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<ModalData>();

  form!: FormGroup;
  selectedFileName: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges() {
    if (this.form && this.initialData) {
      this.form.patchValue({
        title: this.initialData.title,
        description: this.initialData.description
      });
      this.selectedFileName = '';
    } else if (this.form) {
      this.resetForm();
    }
  }

  initializeForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      description: ['', [Validators.required, Validators.minLength(1)]],
      file: [null]
    });
  }

  getModalTitle(): string {
    const action = this.actionType === 'add' ? 'Agregar' : 'Editar';
    const element = this.elementType === 'module' ? 'Módulo' : 
                    this.elementType === 'publication' ? 'Publicación' : 'Contenido';
    return `${action} ${element}`;
  }

  shouldShowFileInput(): boolean {
    return this.elementType === 'publication' || this.elementType === 'content';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.patchValue({ file: file });
      this.selectedFileName = file.name;
    }
  }

  handleSubmit() {
    if (this.form.valid && this.isFormValid()) {
      const formValue = this.form.value;
      const modalData: ModalData = {
        title: formValue.title,
        description: formValue.description,
        file: formValue.file
      };
      this.onSubmit.emit(modalData);
      this.resetForm();
    }
  }

  handleClose() {
    this.onClose.emit();
    this.resetForm();
  }

  isFormValid(): boolean {
    if (!this.form.valid) return false;
    if (this.shouldShowFileInput() && this.actionType === 'add' && !this.form.get('file')?.value) return false;
    return true;
  }

  resetForm() {
    this.form.reset();
    this.selectedFileName = '';
  }
}
