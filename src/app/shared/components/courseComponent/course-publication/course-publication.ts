import { Component } from '@angular/core';
import { YoutubePlayer } from "../course-content-publication/youtube-player/youtube-player";

@Component({
  selector: 'app-course-publication',
  imports: [YoutubePlayer],
  templateUrl: './course-publication.html',
  styleUrl: './course-publication.css'
})
export class CoursePublication {
  videoId:string = 'TCd6PfxOy0Y';
}
