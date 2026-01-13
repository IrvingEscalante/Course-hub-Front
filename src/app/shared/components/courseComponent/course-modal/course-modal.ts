import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessageComponent } from "../../error-message/error-message.component";

export type ActionType = 'add' | 'edit';
export type ElementType = 'module' | 'publication' | 'content';
export type ContentType = 'image' | 'video' | 'video-embed' | 'note' | 'file' | null;

export interface ContentPayload {
  type: Exclude<ContentType, null>;
  file?: File;
  videoUrl?: string;
  note?: string;
  fileName?: string;
  imagePreview?: string;
  // Para contenidos existentes (edición)
  isExisting?: boolean;
  existingId?: number;
  existingUrl?: string;
}

export interface ModalData {
  title: string;
  description: string;
  file?: File;
  contentType?: ContentType;
  contents?: ContentPayload[];
  deletedContentIds?: number[];
}

@Component({
  selector: 'app-course-modal',
  imports: [CommonModule, ReactiveFormsModule, ErrorMessageComponent],
  templateUrl: './course-modal.html',
  styleUrl: './course-modal.css'
})
export class CourseModal implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() actionType: ActionType = 'add';
  @Input() elementType: ElementType = 'module';
  @Input() initialData?: ModalData;
  
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<ModalData>();
  loading: boolean = false;
  form!: FormGroup;
  selectedFileName: string = '';
  selectedContentType: ContentType = null;
  contents: ContentPayload[] = [];
  currentImagePreview: string | null = null;
  deletedContentIds: number[] = [];
  isSubmitting: boolean = false;
  isAddingContent: boolean = false;
  isClosing: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) return;

    if (changes['isOpen'] && changes['isOpen'].previousValue && changes['isOpen'].currentValue === false) {
      this.resetForm();
      return;
    }

    if (this.initialData) {
      this.form.patchValue({
        title: this.initialData.title,
        description: this.initialData.description
      });
      this.selectedFileName = '';
      this.contents = this.initialData.contents && this.initialData.contents.length > 0 ? [...this.initialData.contents] : [];
      this.currentImagePreview = null;
      this.selectedContentType = null;
      this.deletedContentIds = [];
      this.isSubmitting = false;
      this.isAddingContent = false;
      this.isClosing = false;
    } else {
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

  isContentValid(): boolean {
    if (!this.selectedContentType) return false;

    const file = this.form.get('file')?.value as File | null;
    const videoUrl = this.form.get('videoUrl')?.value as string;
    const note = this.form.get('note')?.value as string;

    if (this.selectedContentType === 'image' || this.selectedContentType === 'video' || this.selectedContentType === 'file') {
      return !!file;
    } else if (this.selectedContentType === 'video-embed') {
      return !!videoUrl && videoUrl.trim().length > 0;
    } else if (this.selectedContentType === 'note') {
      return !!note && note.trim().length > 0;
    }

    return false;
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
    if (!this.selectedContentType || this.isAddingContent || this.isSubmitting) return;

    this.isAddingContent = true;

    const file = this.form.get('file')?.value as File | null;
    const videembed = this.form.get('videoUrl')?.value as string;
    const note = this.form.get('note')?.value as string;

    let content: ContentPayload | null = null;

    if (this.selectedContentType === 'image' || this.selectedContentType === 'file' || this.selectedContentType === 'video') {
      if (!file) return;
      content = {
        type: this.selectedContentType,
        file,
        fileName: file.name,
        imagePreview: this.selectedContentType === 'image' ? this.currentImagePreview || undefined : undefined
      };
    }else if (this.selectedContentType === 'video-embed') {
      if (!videembed) return;
      content = {
        type: 'video-embed',
        videoUrl: videembed
      };
    } 
    else if (this.selectedContentType === 'note') {
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

    setTimeout(() => {
      this.isAddingContent = false;
    }, 0);
  }

  handleSubmit() {
    if (this.isSubmitting) return;

    if (this.form.valid && this.isFormValid()) {
      this.loading = true;
      this.isSubmitting = true;
      const formValue = this.form.value;
      const modalData: ModalData = {
        title: formValue.title,
        description: formValue.description,
        file: formValue.file,
        contentType: this.selectedContentType,
        contents: this.contents,
        deletedContentIds: this.deletedContentIds
      };
      this.onSubmit.emit(modalData);
    }
  }

  handleClose() {
    if (this.isClosing) return;

    this.isClosing = true;
    this.onClose.emit();
  }

  isFormValid(): boolean {
    if (!this.form.valid) return false;

    // Para publicaciones y contenidos: requiere al menos 1 contenido de cualquier tipo
    if (this.elementType === 'publication' || this.elementType === 'content') {
      return this.contents.length >= 1;
    }

    // Para módulos: solo necesita título y descripción
    return true;
  }

  resetForm() {
    this.form.reset();
    this.selectedFileName = '';
    this.selectedContentType = null;
    this.contents = [];
    this.currentImagePreview = null;
    this.deletedContentIds = [];
    this.loading = false;
    this.isSubmitting = false;
    this.isAddingContent = false;
    this.isClosing = false;
  }

  clearContentInputs() {
    this.form.patchValue({ file: null, videoUrl: '', note: '' });
    this.selectedFileName = '';
    this.selectedContentType = null;
    this.currentImagePreview = null;
  }

  removeContent(index: number) {
    const contentToRemove = this.contents[index];
    // Si es contenido existente, rastrear su ID para eliminarlo en el backend
    if (contentToRemove.isExisting && contentToRemove.existingId) {
      this.deletedContentIds.push(contentToRemove.existingId);
    }
    this.contents = this.contents.filter((_, i) => i !== index);
  }
}
