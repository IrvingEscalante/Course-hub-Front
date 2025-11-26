import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CourseListComments } from "../course-list-comments/course-list-comments";
import { RatingCommentsService } from '../../../../core/services/courses/rating-comments.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseUserComment } from "../course-user-comment/course-user-comment";
import { RatingCommentsResponse } from '../../../../core/models/rating_comments';
import { LoaderService } from '../../../../core/services/loader';

@Component({
  selector: 'app-course-comments',
  imports: [ReactiveFormsModule, CourseUserComment],
  templateUrl: './course-comments.html',
  styleUrl: './course-comments.css'
})
export class CourseComments {
  @Input() value: number = 0;       // Calificación inicial
  @Output() valueChange = new EventEmitter<number>();
  @Input() id_course:number=0;
  ratingCommentsService = inject(RatingCommentsService);
  loaderService=inject(LoaderService);
  stars = [1, 2, 3, 4, 5];
  commentForm!: FormGroup;
  comments:RatingCommentsResponse[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.commentForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1)]],
      comment: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.getAllComments(this.id_course);
  }

  setRating(rate: number) {
    this.value = rate;
    this.valueChange.emit(rate);   
    this.commentForm.get('rating')?.setValue(rate);
  }


  onSubmit() {
    this.loaderService.show();
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    const payload = {
      rating: this.commentForm.value.rating,
      comment_detail: this.commentForm.value.comment,
      id_course: this.id_course, // ajusta si lo recibes como @Input()
    };

    console.log("ENVIANDO:", payload);
    this.ratingCommentsService.createRating(payload).subscribe({
      next:(data)=>{
        console.log("Enviado correctamente");
        this.loaderService.hide();
        this.getAllComments(this.id_course);
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }

  getAllComments(id_course:number){
    this.ratingCommentsService.getAllComments(id_course).subscribe({
      next:(data)=>{
        console.log(data);
        this.comments = data;
      },
      error:(err)=>{
        console.log(err);
      }
    });

  }
}
