
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PartService } from '../../server';
import { TimeAgoPipe } from '../../../../../../pipes/time-ago.pipe';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-sub5',
templateUrl: './sub5.component.html',
  styleUrls: ['./sub5.component.css'],
  standalone: true,
  imports: [CommonModule, TimeAgoPipe ,RouterModule]
  
})
export class Sub5Component  implements OnInit {

  breadcrumbTitle: string = ' الأخبار الرياضية ';

  newsId: string | null = null;
  newsTitle: string = '';
  newsImage: string = '';
  newsContent: string = '';
  newsAuthor: string = '';
  newsDate: string = '';

  loading: boolean = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private partService: PartService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.newsId = params['id'];
      if (this.newsId) {
        this.loadNewsDetails(this.newsId);
      }
    });
  }

  loadNewsDetails(id: string): void {
    this.loading = true;
    this.error = null;

    this.partService.getPostDetails(id).subscribe({
      next: (data: any) => {
        if (data) {
          this.newsTitle = data.post_title || 'عنوان غير موجود';
          this.breadcrumbTitle = this.newsTitle;

          this.newsImage = data.post_image
            ? (data.post_image.startsWith('http')
                ? data.post_image
                : 'http://localhost/news/backend/upload/' + data.post_image)
            : 'http://localhost/news/backend/upload/default-image.jpg';

          this.newsContent = data.post_body || 'تفاصيل غير موجودة';
          this.newsAuthor = data.post_author || 'غير معروف';
          this.newsDate = data.post_date || new Date().toISOString();
        } else {
          this.error = 'لا توجد بيانات للخبر';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('خطأ أثناء تحميل تفاصيل الخبر', err);
        this.error = 'حدث خطأ أثناء تحميل التفاصيل، يرجى المحاولة لاحقاً';
        this.loading = false;
      }
    });
  }

  // 🔹 دالة النزول إلى قسم "أقسام الموقع" مثل Main11Component
  scrollToSections(): void {
    if (this.router.url === '/home' || this.router.url === '/') {
      const element = document.getElementById('sections');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      this.router.navigate(['/home']).then(() => {
        setTimeout(() => {
          const element = document.getElementById('sections');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 50);
      });
    }
  }
}
