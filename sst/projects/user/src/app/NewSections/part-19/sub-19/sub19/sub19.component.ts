import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PartService } from '../../server';
import { TimeAgoPipe } from '../../../../../../pipes/time-ago.pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sub19',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe, RouterModule],
  templateUrl: './sub19.component.html',
  styleUrls: ['./sub19.component.css']
})
export class Sub19Component implements OnInit {

  breadcrumbTitle = 'مال وأعمال';

  newsId!: string;
  newsTitle = '';
  newsImage = '';
  newsContent = '';
  newsAuthor = '';
  newsDate = '';

  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private partService: PartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        this.error = 'معرف الخبر غير موجود';
        this.loading = false;
        return;
      }

      this.newsId = id;
      this.loadNewsDetails(id);
    });
  }

  loadNewsDetails(id: string): void {
    this.loading = true;
    this.error = null;

    this.partService.getPostDetails19(id).subscribe({
      next: (data) => {
        if (!data || data.error) {
          this.error = data?.error || 'لا توجد بيانات للخبر';
          this.loading = false;
          return;
        }

        this.newsTitle = data.post_title;
        this.breadcrumbTitle = data.post_title;
        this.newsContent = data.post_body;
        this.newsAuthor = data.post_author;
        this.newsDate = data.post_date;

        this.newsImage = data.post_image
          ? (data.post_image.startsWith('http')
              ? data.post_image
              : 'http://localhost/news/backend/upload/' + data.post_image)
          : 'http://localhost/news/backend/upload/default-image.jpg';

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'حدث خطأ أثناء تحميل الخبر';
        this.loading = false;
      }
    });
  }

  scrollToSections(): void {
    if (this.router.url === '/home' || this.router.url === '/') {
      document.getElementById('sections')
        ?.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/home']).then(() => {
        setTimeout(() => {
          document.getElementById('sections')
            ?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      });
    }
  }
}
