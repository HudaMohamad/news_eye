import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TimeAgoPipe } from '../../../../../pipes/time-ago.pipe';
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
  selector: 'app-photo-news',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TimeAgoPipe,
    ImgFallbackDirective
  ],
  templateUrl: './photo-news.component.html',
  styleUrls: ['./photo-news.component.css']
})
export class PhotoNewsComponent implements OnInit {

  // نقوم بتخزين الأخبار هنا
  photoNews: NewsItem[] = [];

  // نقوم بتخزين الأخبار في newsCards لعرضها في HTML
  newsCards: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // جلب البيانات من الخادم
    this.http.get<NewsItem[]>('http://localhost/news/backend/photographer.php')
      .subscribe({
        next: data => {
          this.photoNews = data;
          // تجهيز البيانات لعرضها في الواجهة
          this.newsCards = data.map((news: NewsItem) => ({
            title: news.post_title,
            img: news.post_image,
            category: news.post_tags,  // فئة الخبر
            author: news.post_author,  // مؤلف الخبر
            icon: news.category_icon,  // أيقونة القسم
            date: news.post_date,      // تاريخ الخبر
            link: `/part-${news.part}/sub-${news.part}/${news.id}`  // رابط الخبر
          }));
        },
        error: err => {
          console.error('خطأ في جلب الأخبار المصورة', err);
        }
      });
  }
}
