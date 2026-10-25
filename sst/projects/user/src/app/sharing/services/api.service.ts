import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Part {
  part_id: string;
  part_name: string;
  part_level: string;
  lnk: string;
  part_icon: string;
  part_color: string;
  part_shadow: string;
  part_button: string;
}

export interface PostResponse {
  status: string;
  message: string;
  post_id?: number;
  title?: string;
  table?: string;
  category_id?: number;
}

export interface PostData {
  title: string;
  content: string;
  author?: string;
  tags?: string;
  categories: (number | string)[];
  options: {
    published: boolean;
    main: boolean;
    photographer: boolean;
    block: boolean;
    inLast: boolean;
    topmain: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost';
  
  constructor(private http: HttpClient) {}

  getAllParts(): Observable<Part[]> {
    return this.http.get<Part[]>('http://localhost/news/backend/part.php');
  }

  // إضافة الخبر الجديد
  addPost(postData: PostData): Observable<PostResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    return this.http.post<PostResponse>(
      `${this.baseUrl}/add_post.php`, // تأكد من المسار الصحيح
      postData,
      httpOptions
    );
  }
}