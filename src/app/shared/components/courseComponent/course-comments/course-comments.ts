import { Component, EventEmitter, inject, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CourseListComments } from "../course-list-comments/course-list-comments";
import { RatingCommentsService } from '../../../../core/services/courses/rating-comments.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseUserComment } from "../course-user-comment/course-user-comment";
import { RatingCommentsResponse } from '../../../../core/models/rating_comments';
import { LoaderService } from '../../../../core/services/loader';
import { ToastService } from '../../../../core/services/toast.service';
import { RouterModule } from '@angular/router';
import { UserOut } from '../../../../core/models/user.model';

@Component({
  selector: 'app-course-comments',
  imports: [ReactiveFormsModule, CourseUserComment, RouterModule],
  templateUrl: './course-comments.html',
  styleUrl: './course-comments.css'
})
export class CourseComments {
  @Input() value: number = 0;       // Calificación inicial
  @Input() userLogged: UserOut | null = null;
  @Output() valueChange = new EventEmitter<number>();
  @Input() id_course:number=0;
  @ViewChild('commentFormSection') commentFormSection!: ElementRef;
  ratingCommentsService = inject(RatingCommentsService);
  toastService = inject(ToastService);
  loaderService=inject(LoaderService);
  stars = [1, 2, 3, 4, 5];
  commentForm!: FormGroup;
  comments:RatingCommentsResponse[] = [];
  editingCommentId: number | null = null;
  loadingSendEdit:boolean = false;

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

    if (this.editingCommentId !== null) {
      this.loadingSendEdit = true;
      // Modo edición
      const updatePayload = {
        rating: this.commentForm.value.rating,
        comment_detail: this.commentForm.value.comment,
      };

      this.ratingCommentsService.updateRating(this.editingCommentId, updatePayload).subscribe({
        next:(data)=>{
          console.log("Comentario actualizado correctamente");
          this.loaderService.hide();
          this.loadingSendEdit = false;
          this.cancelEditComment();
          this.getAllComments(this.id_course);
          this.toastService.success("Comentario actualizado correctamente");
        },
        error:(err)=>{
          this.loaderService.hide();
          this.loadingSendEdit = false;
          this.toastService.error(err.error.detail);
        }
      });
    } else {
      // Modo crear
      this.loadingSendEdit = true;
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
          this.loadingSendEdit = false;
          this.value = 0;
          this.commentForm.reset({rating: 0, comment: ''});
          this.getAllComments(this.id_course);
          this.toastService.success("Su calificación y comentario hacia el curso se enviaron correctamente");
        },
        error:(err)=>{
          this.loaderService.hide();
          this.loadingSendEdit = false;
          this.toastService.error(err.error.detail);
        }
      });
    }
  }

  getAllComments(id_course:number){
    this.ratingCommentsService.getAllComments(id_course).subscribe({
      next:(data)=>{
        this.comments = data;
      },
      error:(err)=>{
      }
    });
  }

  deleteComment(id_rating:number){
    this.loaderService.show();
    this.ratingCommentsService.deleteRating(id_rating).subscribe({
      next:(data)=>{
        this.loaderService.hide();
        this.getAllComments(this.id_course);
        this.toastService.success(data.message);
      },
      error:(err)=>{
        this.loaderService.hide();
        this.toastService.error(err.error.detail);
      }
    });
  }

  editComment(comment: RatingCommentsResponse){
    this.editingCommentId = comment.id_ratings_comments;
    this.commentForm.patchValue({
      rating: comment.rating,
      comment: comment.comment_detail
    });
    this.value = comment.rating;
    // Scroll al contenedor del formulario
    if (this.commentFormSection) {
      this.commentFormSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  cancelEditComment(){
    this.editingCommentId = null;
    this.value = 0;
    this.commentForm.reset({rating: 0, comment: ''});
  }
}
