import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-more',
  templateUrl: './video-more.component.html',
  styleUrls: ['./video-more.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class VideoMoreComponent implements OnChanges {

  @Input() videoLink!: string;
  videoUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges() {
    if (this.videoLink) {
      const id = this.extractVideoId(this.videoLink);
      if (id) {
     this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
  `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&controls=1&autoplay=0`
);
;
      }
    }
  }

  private extractVideoId(link: string): string | null {
  let videoId: string | null = null;

  if (link.includes('youtu.be/')) {
    const parts = link.split('youtu.be/');
    if (parts.length > 1) videoId = parts[1].split('?')[0];
  } 
  else if (link.includes('youtube.com/watch?v=')) {
    const parts = link.split('v=');
    if (parts.length > 1) videoId = parts[1].split('&')[0];
  }
  else if (link.includes('youtube.com/shorts/')) {  // <-- إضافة دعم shorts
    const parts = link.split('shorts/');
    if (parts.length > 1) videoId = parts[1].split('?')[0];
  }

  return videoId;
}

}  