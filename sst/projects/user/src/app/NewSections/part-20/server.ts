import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartService {

  private backendBase = 'http://localhost/news/backend';

  constructor(private http: HttpClient) {}

  /**
   * جلب الأخبار من post20.php
   */
  getPostsFromPart20(page: number = 1, itemsPerPage: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('itemsPerPage', itemsPerPage.toString());
    
    const url = `${this.backendBase}/post20.php`;
    return this.http.get<any>(url, { params });
  }

  /**
   * جلب تفاصيل الخبر باستخدام الـ ID
   */
  getPostDetails(id: string): Observable<any> {
    const url = `${this.backendBase}/getPostDetails20.php`;
    const params = new HttpParams().set('id', id);

    return this.http.get<any>(url, { params }).pipe(
      map((post: any) => {
        // تأكد أن extra_images دائمًا مصفوفة
        if (!post.extra_images || !Array.isArray(post.extra_images)) {
          post.extra_images = [];
        }
        return post;
      })
    );
  }

  /**
   * دالة بديلة إذا أردت استخدام معلمة table
   */
  getPostDetailsWithTable(id: string, table: string = 'post20'): Observable<any> {
    const url = `${this.backendBase}/getPostDetails20.php`;
    const params = new HttpParams()
      .set('id', id)
      .set('table', table);

    return this.http.get<any>(url, { params }).pipe(
      map((post: any) => {
        if (!post.extra_images || !Array.isArray(post.extra_images)) {
          post.extra_images = [];
        }
        return post;
      })
    );
  }
}
