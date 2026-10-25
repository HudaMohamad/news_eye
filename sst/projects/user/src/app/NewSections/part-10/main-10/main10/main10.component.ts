
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TimeAgoPipe } from '../../../../../../pipes/time-ago.pipe';
import { PartService } from '../../server';

@Component({
  selector: 'app-main10',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TimeAgoPipe
  ],
  templateUrl: './main10.component.html',
  styleUrls: ['./main10.component.css']
})
export class Main10Component implements OnInit {

  displayedPosts: any[] = [];
  allPosts: any[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  totalItems = 0;

  pageNumbers: number[] = [];
  maxPagesToShow = 6;

  constructor(private partService: PartService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllPosts();
  }

  // 🔹 تحميل كل الأخبار + ترتيبها + تجهيز الصورة
  loadAllPosts(): void {
    this.partService.getPostsFromPart10(1, 1000).subscribe({
      next: (data: any) => {
        this.allPosts = (data.posts || [])
          .map((post: any) => ({
            ...post,
            imageUrl: post.post_image?.startsWith('http')
              ? post.post_image
              : post.post_image
                ? 'http://localhost/news/backend/upload/' + post.post_image
                : 'http://localhost/news/backend/upload/default-image.jpg',
                category_icon: post.category_icon || ''// التأكد من وجود الأيقونة
          }))
          .sort(
            (a: any, b: any) =>
              new Date(b.post_date).getTime() -
              new Date(a.post_date).getTime()
          );

        this.totalItems = this.allPosts.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

        this.goToPage(1);
      },
      error: (err) => console.error('خطأ أثناء جلب البيانات', err)
    });
  }

  // 🔹 Pagination محلي
  goToPage(page: number): void {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;

    this.currentPage = page;

    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    this.displayedPosts = this.allPosts.slice(start, end);

    this.updatePagination();
  }

  nextPage() { this.goToPage(this.currentPage + 1); }
  prevPage() { this.goToPage(this.currentPage - 1); }
  firstPage() { this.goToPage(1); }
  lastPage() { this.goToPage(this.totalPages); }

  updatePagination(): void {
    let start = Math.max(this.currentPage - Math.floor(this.maxPagesToShow / 2), 1);
    let end = start + this.maxPagesToShow - 1;

    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(end - this.maxPagesToShow + 1, 1);
    }

    this.pageNumbers = [];
    for (let i = start; i <= end; i++) {
      this.pageNumbers.push(i);
    }

    this.pageNumbers.reverse();
  }

  // 🔹 دالة النزول إلى قسم "أقسام الموقع"
 scrollToSections(): void {
  const scrollToElement = () => {
    const element = document.getElementById('sections');
    if (element) {
      const headerOffset = 80; // ارتفاع الهيدر الثابت
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (this.router.url === '/home' || this.router.url === '/') {
    // انتظر قليلًا قبل الـ scroll لضمان أن DOM جاهز
    setTimeout(scrollToElement, 150);
  } else {
    this.router.navigate(['/home']).then(() => {
      // زيادة الوقت قليلاً لضمان تحميل الأقسام
      setTimeout(scrollToElement, 250);
    });
  }
}

}
