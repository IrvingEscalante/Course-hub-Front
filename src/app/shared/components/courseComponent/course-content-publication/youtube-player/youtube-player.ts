import { Component, Input } from '@angular/core';
import { YouTubePlayer } from "@angular/youtube-player";

@Component({
  selector: 'app-youtube-player',
  imports: [YouTubePlayer],
  templateUrl: './youtube-player.html',
  styleUrl: './youtube-player.css'
})
export class YoutubePlayer {
  @Input() video: string = '';

}
