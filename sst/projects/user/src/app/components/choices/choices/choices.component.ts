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
  selector: 'app-choices',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TimeAgoPipe,
    ImgFallbackDirective
  ],
  templateUrl: './choices.component.html',
  styleUrls: ['./choices.component.css'],
})
export class ChoicesComponent implements OnInit {

  newsCards: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<NewsItem[]>('http://localhost/news/backend/block.php')
      .subscribe({
        next: data => {
          this.newsCards = data.map(news => ({
            title: news.post_title,
            img: news.post_image.startsWith('http') 
                   ? news.post_image 
                   : `http://localhost/news/backend/upload/${news.post_image}`,
            category: news.post_tags,
            icon: news.category_icon, // أيقونة القسم
            author: news.post_author,
            date: news.post_date,
            link: `/part-${news.part}/sub-${news.part}/${news.id}` // رابط الخبر
          }));
        },
        error: err => console.error('خطأ في جلب الأخبار المصورة', err)
      });
  }
}
