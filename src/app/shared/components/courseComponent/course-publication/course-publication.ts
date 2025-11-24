import { Component, Input, Output, EventEmitter } from '@angular/core';
import { YoutubePlayer } from "../course-content-publication/youtube-player/youtube-player";
import { CoursePublishResponse } from '../../../../core/models/detail_course.model';

@Component({
  selector: 'app-course-publication',
  imports: [YoutubePlayer],
  templateUrl: './course-publication.html',
  styleUrl: './course-publication.css'
})
export class CoursePublication {
  videoId:string = 'nKPbfIU442g';
  @Input() publication!: CoursePublishResponse;
  @Output() pdfClick = new EventEmitter<string>();

  openPdf(url: string) {
    this.pdfClick.emit(url);
    console.log("evencto")
  }
}
