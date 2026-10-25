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
   * ✅ جلب الأخبار من post6.php
   * مع إضافة معلمات الصفحة وعدد العناصر في الصفحة
   */
  getPostsFromPart6(page: number = 1, itemsPerPage: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('itemsPerPage', itemsPerPage.toString());
    
    const url = `${this.backendBase}/post6.php`;  // استدعاء post6.php مع المعلمات
    return this.http.get<any>(url, { params });  // هذا يرجع البيانات في شكل Observable
  }

  /**
   * ✅ جلب تفاصيل الخبر باستخدام الـ ID
   * استرجاع تفاصيل الخبر من الـ backend
   */
  getPostDetails(id: string): Observable<any> {
    const url = `${this.backendBase}/getPostDetails6.php`;  // استرجاع تفاصيل الخبر
    const params = new HttpParams().set('id', id);

    return this.http.get<any>(url, { params });
  }
}
