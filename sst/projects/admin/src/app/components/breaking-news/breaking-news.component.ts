import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-breaking-news',
  templateUrl: './breaking-news.component.html',
  styleUrls: ['./breaking-news.component.css']
})
export class BreakingNewsComponent {
  puns: string[] = []; // الأخبار المسترجعة من قاعدة البيانات
  newNews: string = ''; // نص الخبر الجديد
  today: string = new Date().toLocaleDateString();

  constructor(private http: HttpClient) {
    this.loadNews();
  }

  // تحميل الأخبار من PHP
  loadNews() {
    this.http.get<any>('http://localhost/news/backend/BreakingNews.php')
      .subscribe(res => {
        if (res.status === 'success') {
          this.puns = res.data;
        }
      });
  }

  // إضافة خبر جديد
  addNews() {
    if (!this.newNews.trim()) return;

    this.http.post<any>('http://localhost/news/backend/AddBreakingNews.php', {
      text: this.newNews
    }).subscribe(res => {
      if (res.status === 'success') {
        this.puns.unshift(this.newNews); // إضافة الخبر للواجهة مباشرة
        this.newNews = ''; // مسح input
      } else {
        alert(res.message);
      }
    }, err => {
      console.error(err);
      alert('حدث خطأ أثناء إرسال الخبر.');
    });
  }

  deleteNews(index: number) {
  const newsToDelete = this.puns[index];

  if(!confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;

  this.http.post<any>('http://localhost/news/backend/DeleteBreakingNews.php', {
    text: newsToDelete
  }).subscribe(res => {
    if(res.status === 'success') {
      this.puns.splice(index, 1); // إزالة الخبر من الواجهة
    } else {
      alert(res.message);
    }
  }, err => {
    console.error(err);
    alert('حدث خطأ أثناء حذف الخبر.');
  });
}

}
