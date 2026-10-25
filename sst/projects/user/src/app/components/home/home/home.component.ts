import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TimeAgoPipe } from '../../../../../pipes/time-ago.pipe';
import { TrackingService } from '../../../services/tracking.service';

// Standalone Components
import { SectionsComponent } from '../../sections/sections/sections.component';
import { PhotoNewsComponent } from '../../photoNews/photo-news/photo-news.component';
import { ChoicesComponent } from '../../choices/choices/choices.component';
import { VideoMoreComponent } from '../../video-more/video-more/video-more.component';
import { FollowComponent } from '../../follow/follow/follow.component';
import { MoreReadComponent } from '../../more-read/more-read.component';
import { BreakingNewsComponent } from '../../breaking-news/breaking-news.component';
import { sectionName } from '../../../sharing/section-names';
import { ImgFallbackDirective } from '../../../sharing/img-fallback.directive';

interface NewsItem {
  id: number;
  post_title: string;
  post_body?: string;
  post_image: string;
  post_date: string;
  post_author: string;
  post_tags?: string;
  post_visits_num?: number;
  category_icon?: string;
  part: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TimeAgoPipe,
    SectionsComponent,
    PhotoNewsComponent,
    ChoicesComponent,
    VideoMoreComponent,
    FollowComponent,
    MoreReadComponent,
    BreakingNewsComponent,
    ImgFallbackDirective
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // ================== السلايدر ==================
  sliderNews: NewsItem[] = [];
  sliderIndicators: number[] = [];

  // ================== أهم الأخبار (يمين) ==================
  rightNews: NewsItem[] = [];

  // ================== خبر عربي رئيسي واحد ==================
  arabicMainNews: NewsItem | null = null;

  // ================== آخر فيديو ==================
  latestVideo: any = null;

  sectionName = sectionName;

  constructor(
    private http: HttpClient,
    private trackingService: TrackingService
  ) { }

  ngOnInit(): void {
    // ---------- السلايدر ----------
    this.http.get<NewsItem[]>('http://localhost/news/backend/news-slider.php')
      .subscribe({
        next: data => {
          this.sliderNews = data;
          this.sliderIndicators = data.map((_, i) => i);
        },
        error: err => console.error('خطأ في جلب أخبار السلايدر', err)
      });

    // ---------- أهم الأخبار ----------
    this.http.get<NewsItem[]>('http://localhost/news/backend/main.php')
      .subscribe({
        next: data => {
          this.rightNews = data;
        },
        error: err => console.error('خطأ في جلب أهم الأخبار', err)
      });

    // ---------- خبر عربي رئيسي واحد ----------
    this.http.get<NewsItem[]>('http://localhost/news/backend/topmain.php')
      .subscribe({
        next: data => {
          this.arabicMainNews = data.length ? data[0] : null;
        },
        error: err => console.error('خطأ في جلب الخبر العربي الرئيسي', err)
      });

    // ---------- آخر فيديو ----------
    this.http.get<any>('http://localhost/news/backend/get_videos.php')
      .subscribe({
        next: res => {
          if (res.status === 'success' && res.videos.length > 0) {
            this.latestVideo = res.videos[0];
          }
        },
        error: err => console.error('خطأ في جلب الفيديوهات', err)
      });
  }
}





