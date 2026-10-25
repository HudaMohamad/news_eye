import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartService {

  private backendBase = 'http://localhost/news/backend';  // رابط الـ API

  constructor(private http: HttpClient) {}

  /**
   * ✅ جلب الأخبار من جدول post19
   * مع إضافة معلمات الصفحة وعدد العناصر في الصفحة
   */
  getPostsFromPart19(page: number = 1, itemsPerPage: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('itemsPerPage', itemsPerPage.toString());

    const url = `${this.backendBase}/post19.php`;  // تأكد من وجود هذا الملف للجزء 19
    return this.http.get<any>(url, { params });
  }

  /**
   * ✅ جلب تفاصيل الخبر من جدول post19 باستخدام الـ ID
   */
  getPostDetails19(id: string): Observable<any> {
    const url = `${this.backendBase}/getPostDetails19.php`;  // ملف التفاصيل الجديد
    const params = new HttpParams().set('id', id);

    return this.http.get<any>(url, { params });
  }
}
