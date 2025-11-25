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
  ngOnInit() {
  if (this.publication?.content) {

    const priority: Record<string, number> = {
      pdf: 1,
      pptx: 1,
      video: 2,
      youtube: 2,
      note: 3,
      image: 3,
      text: 3,
      other: 3
    };

    this.publication.content = [...this.publication.content].sort((a, b) => {
      const pa = priority[a.type_content] ?? 99;
      const pb = priority[b.type_content] ?? 99;
      return pa - pb;
    });

  }
}

}
