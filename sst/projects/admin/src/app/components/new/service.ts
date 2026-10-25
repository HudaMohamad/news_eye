import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ================= واجهات البيانات =================
export interface Part {
  part_id: number;
  part_name: string;
  part_icon: string;
  lnk: string;
   selected?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

   private baseUrl = 'http://localhost/news/backend'; // رابط الـ API

  constructor(private http: HttpClient) { }

  // ================= جلب كل الأقسام =================
  getAllParts(): Observable<Part[]> {
    return this.http.get<Part[]>(`${this.baseUrl}/part.php`);
  }

  // ================= جلب الأخبار بناءً على الـ category_id =================
  getPostsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/fetch-posts.php?category_id=${categoryId}`);
  }

  // في service.ts
deletePost(id: number, categoryId: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/fetch-delete-posts.php?id=${id}&category_id=${categoryId}`);
}



}
