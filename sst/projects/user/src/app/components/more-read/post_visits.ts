import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post {
  post_id: number;
  post_title: string;
  post_image: string;
  post_author: string;
  post_date: string;
  post_visits_num: number;
  part: number;
  link?: string;  // سيتم توليد الرابط ديناميكيًا
}

@Injectable({
  providedIn: 'root'
})
export class PostVisitsService {

  private apiUrl = 'http://localhost/news/backend/post_visits.php';

  constructor(private http: HttpClient) {}

  getMostViewed(limit: number = 4): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}?limit=${limit}`);
  }
}
