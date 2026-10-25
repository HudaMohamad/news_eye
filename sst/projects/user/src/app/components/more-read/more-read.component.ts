import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostVisitsService, Post } from './post_visits';
import { RouterModule } from '@angular/router';
import { ImgFallbackDirective } from '../../sharing/img-fallback.directive';

@Component({
  selector: 'app-more-read',
  standalone: true,
  imports: [CommonModule, RouterModule, ImgFallbackDirective],
  templateUrl: './more-read.component.html',
  styleUrls: ['./more-read.component.css']
})
export class MoreReadComponent implements OnInit {

  mostRead: (Post & { link: string })[] = [];
  loading = true;

  constructor(private postService: PostVisitsService) {}

  ngOnInit(): void {
    this.postService.getMostViewed(4).subscribe({
      next: (data) => {
        // توليد الرابط الديناميكي لكل خبر
        this.mostRead = data.map(post => ({
          ...post,
          link: `/part-${post.part}/sub-${post.part}/${post.post_id}`
        }));
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
