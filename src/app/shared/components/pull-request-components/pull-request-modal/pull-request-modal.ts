import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesService } from '../../../../core/services/courses/courses.service';
import { Course } from '../../../../core/models/course.model';
import { RouterLink, RouterModule } from "@angular/router";

export interface PullRequestModalData {
  title?: string;
  description?: string;
}

@Component({
  selector: 'app-pull-request-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './pull-request-modal.html',
  styleUrl: './pull-request-modal.css'
})
export class PullRequestModal implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() targetCourseId: number=0;
  
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<PullRequestModalData>();

  form!: FormGroup;
  courseService=inject(CoursesService);
  @Input() courseOriginal?:Course;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.fb.group({
      title: ['', [Validators.minLength(3)]],
      description: ['', [Validators.minLength(5)]]
    });
  }

  handleSubmit() {
    const formValue = this.form.value;
    const prData: PullRequestModalData = {
      title: formValue.title || undefined,
      description: formValue.description || undefined
    };
    this.onSubmit.emit(prData);
    this.resetForm();
  }

  handleClose() {
    this.onClose.emit();
    this.resetForm();
  }

  resetForm() {
    this.form.reset();
  }

  isFormValid(): boolean {
    // Permite enviar sin llenar los campos (son opcionales)
    return true;
  }
}
