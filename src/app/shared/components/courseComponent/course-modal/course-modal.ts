import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

export type ActionType = 'add' | 'edit';
export type ElementType = 'module' | 'publication' | 'content';
export type ContentType = 'image' | 'video' | 'note' | 'file' | null;

export interface ContentPayload {
  type: Exclude<ContentType, null>;
  file?: File;
  videoUrl?: string;
  note?: string;
  fileName?: string;
  imagePreview?: string;
}

export interface ModalData {
  title: string;
  description: string;
  file?: File;
  contentType?: ContentType;
  contents?: ContentPayload[];
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
  selectedContentType: ContentType = null;
  contents: ContentPayload[] = [];
  currentImagePreview: string | null = null;

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
      this.contents = [];
    } else if (this.form) {
      this.resetForm();
    }
  }

  initializeForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      description: ['', [Validators.required, Validators.minLength(1)]],
      file: [null],
      videoUrl: [''],
      note: ['']
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

  selectContentType(type: ContentType) {
    this.selectedContentType = this.selectedContentType === type ? null : type;
  }

  isContentTypeSelected(type: ContentType): boolean {
    return this.selectedContentType === type;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.patchValue({ file: file });
      this.selectedFileName = file.name;

      // Generar previsualización si es imagen
      if (this.selectedContentType === 'image' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.currentImagePreview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.currentImagePreview = null;
      }
    }
  }

  addContentFromSelection() {
    if (!this.selectedContentType) return;

    const file = this.form.get('file')?.value as File | null;
    const videoUrl = this.form.get('videoUrl')?.value as string;
    const note = this.form.get('note')?.value as string;

    let content: ContentPayload | null = null;

    if (this.selectedContentType === 'image' || this.selectedContentType === 'file') {
      if (!file) return;
      content = {
        type: this.selectedContentType,
        file,
        fileName: file.name,
        imagePreview: this.selectedContentType === 'image' ? this.currentImagePreview || undefined : undefined
      };
    } else if (this.selectedContentType === 'video') {
      if (!videoUrl) return;
      content = {
        type: 'video',
        videoUrl
      };
    } else if (this.selectedContentType === 'note') {
      if (!note) return;
      content = {
        type: 'note',
        note
      };
    }

    if (content) {
      this.contents = [...this.contents, content];
      this.clearContentInputs();
    }
  }

  handleSubmit() {
    if (this.form.valid && this.isFormValid()) {
      const formValue = this.form.value;
      const modalData: ModalData = {
        title: formValue.title,
        description: formValue.description,
        file: formValue.file,
        contentType: this.selectedContentType,
        contents: this.contents
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

    const hasContents = this.contents.length > 0;

    if (this.elementType === 'publication' || this.elementType === 'content') {
      if (!hasContents) return false;
    }

    return true;
  }

  resetForm() {
    this.form.reset();
    this.selectedFileName = '';
    this.selectedContentType = null;
    this.contents = [];
    this.currentImagePreview = null;
  }

  clearContentInputs() {
    this.form.patchValue({ file: null, videoUrl: '', note: '' });
    this.selectedFileName = '';
    this.selectedContentType = null;
    this.currentImagePreview = null;
  }

  removeContent(index: number) {
    this.contents = this.contents.filter((_, i) => i !== index);
  }
}
