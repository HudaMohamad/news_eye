import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartService {

  private backendBase = 'http://localhost/news/backend';

  constructor(private http: HttpClient) {}

  /**
   * جلب الأخبار من post9.php
   */
  getPostsFromPart9(page: number = 1, itemsPerPage: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('itemsPerPage', itemsPerPage.toString());
    
    const url = `${this.backendBase}/post9.php`;
    return this.http.get<any>(url, { params });
  }


  getPostDetails(id: string): Observable<any> {
    const url = `${this.backendBase}/getPostDetails9.php`;
    const params = new HttpParams().set('id', id);

    return this.http.get<any>(url, { params });
  }

  /**
   * دالة بديلة إذا أردت استخدام معلمة table
   */
  getPostDetailsWithTable(id: string, table: string = 'post9'): Observable<any> {
    const url = `${this.backendBase}/getPostDetails9.php`;
    const params = new HttpParams()
      .set('id', id)
      .set('table', table);

    return this.http.get<any>(url, { params });
  }
}