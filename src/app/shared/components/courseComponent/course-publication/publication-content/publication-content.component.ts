import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentCoursePublishResponse } from '../../../../../core/models/detail_course.model';
import { YouTubePlayer } from "@angular/youtube-player";

@Component({
  selector: 'app-publication-content',
  imports: [YouTubePlayer, CommonModule],
  templateUrl: './publication-content.component.html',
  styleUrl: './publication-content.component.css'
})
export class PublicationContentComponent {
  @Input() content: ContentCoursePublishResponse[] | null = null;
  @Input() apiUrlBack!: string;
  @Output() pdfClick = new EventEmitter<string>();
  @Output() imageClicked = new EventEmitter<string>();

  hasPdfContent(): boolean {
    if (!this.content) return false;
    return this.content.some(c => 
      c.type_content === 'file' || 
      c.type_content === 'pdf' || 
      c.type_content === 'pptx' || 
      c.type_content === 'docx'
    );
  }

  getFilename(path: string): string {
    const fullName = path.split('/').pop() || path;
    const parts = fullName.split('_');
    if (parts.length > 1 && !isNaN(Number(parts[0]))) {
      return parts.slice(1).join('_');
    }
    return fullName;
  }

  getFileExtension(path: string): string {
    const ext = path.split('.').pop()?.toUpperCase() || 'FILE';
    return ext;
  }

  extractYouTubeId(url: string): string | null {
    if (!url || typeof url !== 'string') return null;

    try {
      const parsedUrl = new URL(url);

      // 1. youtu.be/<id>
      if (parsedUrl.hostname.includes('youtu.be')) {
        const id = parsedUrl.pathname.replace('/', '');
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

  openPdf(url: string) {
    this.pdfClick.emit(url);
  }

  // Image modal methods
  openImageModal(imageUrl: string) {
    this.imageClicked.emit(imageUrl);
  }

  ngOnInit() {
    if (this.content) {
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

      this.content = [...this.content].sort((a, b) => {
        const pa = priority[a.type_content] ?? 99;
        const pb = priority[b.type_content] ?? 99;
        return pa - pb;
      });
    }
  }
}
