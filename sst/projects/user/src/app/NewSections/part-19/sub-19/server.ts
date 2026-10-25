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
   * جلب الأخبار (القائمة) من post19.php
   */
  getPostsFromPart19(page: number = 1, itemsPerPage: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('itemsPerPage', itemsPerPage.toString());

    return this.http.get<any>(
      `${this.backendBase}/post19.php`,
      { params }
    );
  }

  /**
   * جلب تفاصيل خبر واحد (مهم)
   */
  getPostDetails(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);

    return this.http.get<any>(
      `${this.backendBase}/getPostDetails19.php`,
      { params }
    );
  }
}
