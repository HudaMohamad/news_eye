import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartService {

  private backendBase = 'http://localhost/news/backend';  // الرابط الجديد للـ API

  constructor(private http: HttpClient) {}

  /**
   * ✅ جلب الأخبار من part11.php
   * مع إضافة معلمات الصفحة وعدد العناصر في الصفحة
   */
  getPostsFromPart11(page: number = 1, itemsPerPage: number = 11): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('itemsPerPage', itemsPerPage.toString());
    
    const url = `${this.backendBase}/post11.php`;  // استدعاء part11.php مع المعلمات
    return this.http.get<any>(url, { params });  // هذا يرجع البيانات في شكل Observable
  }

  /**
   * ✅ جلب تفاصيل الخبر باستخدام الـ ID
   * استرجاع تفاصيل الخبر من الـ backend
   */
  getPostDetails(id: string): Observable<any> {
    const url = `${this.backendBase}/post_details.php`;  // فرضًا لديك هذا الملف لاسترجاع التفاصيل
    const params = new HttpParams().set('id', id);

    return this.http.get<any>(url, { params });
  }
}
