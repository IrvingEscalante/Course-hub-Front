import { Component, Input, Output, EventEmitter } from '@angular/core';
import { YoutubePlayer } from "../course-content-publication/youtube-player/youtube-player";
import { CoursePublishResponse } from '../../../../core/models/detail_course.model';
import { SafeUrlPipe } from '../../../pipes/safeurlpipe-pipe';
import { environment } from '../../../../../environments/environment';
import { YouTubePlayer } from "@angular/youtube-player";

@Component({
  selector: 'app-course-publication',
  imports: [SafeUrlPipe, YouTubePlayer],
  templateUrl: './course-publication.html',
  styleUrl: './course-publication.css'
})
export class CoursePublication {
  videoId:string = 'nKPbfIU442g';
  apiUrlBack = environment.apiUrlForStatics;
  @Input() publication!: CoursePublishResponse;
  @Output() pdfClick = new EventEmitter<string>();

  openPdf(url: string) {
    console.log(url);
    this.pdfClick.emit(url);
  }
  getFilename(path: string): string {
    return path.split('/').pop() || path;
  }
  extractYouTubeId(url: string): string | null {

  if (!url || typeof url !== 'string') return null;

  try {
    const parsedUrl = new URL(url);

    // 1. youtu.be/<id>
    if (parsedUrl.hostname.includes('youtu.be')) {
      const id = parsedUrl.pathname.replace('/', '');
      console.log(id);
      return id || null;
    }

    // 2. youtube.com/watch?v=<id>
    const vParam = parsedUrl.searchParams.get('v');
    if (vParam) return vParam;

    // 3. youtube.com/embed/<id>
    if (parsedUrl.pathname.includes('/embed/')) {
      const id = parsedUrl.pathname.split('/embed/')[1];
      return id || null;
    }

    // 4. Último intento: extraer ID mediante regex general
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    if (match) return match[1];

    return null;
  } catch {
    return null;
  }
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
