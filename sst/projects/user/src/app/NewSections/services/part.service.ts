import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartService {

  private backendBase = 'http://localhost/news/backend';

  constructor(private http: HttpClient) {}

  /**
   * ✅ جلب الأخبار حسب القسم (part_id) مع دعم للصفحات
   */
  getPostsByPart(page: number = 1, limit: number = 10, partId: number = 1): Observable<any> {
    const offset = (page - 1) * limit;
    const url = `${this.backendBase}/get_posts.php?limit=${limit}&offset=${offset}&part_id=${partId}`;
    return this.http.get<any>(url);
  }

  /**
   * ✅ جلب كل الأقسام
   */
  getAllParts(): Observable<any[]> {
    const url = `${this.backendBase}/part.php`;
    return this.http.get<any[]>(url);
  }
}
