import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// 🟢 واجهة الأقسام
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
// في api.service.ts


export interface DashboardStats {
  total_posts: number;
  total_members: number;
  total_comments: number;
  total_visits: number;
}

// 🟠 واجهة إحصائيات التحليلات المخصصة
export interface AnalyticsStats {
  totalVisits: number;
  todayVisits: number;
  topSection: string;
  topPostId: number;
}

// 🔵 واجهة المقالات
export interface Post {
  post_id: number;
  post_title: string;
  post_date: string;
  post_visits_num: number;
  published: number;
  main: number;
  photographer: number;
  topmain: number;
  block: number;
  inLast: number;
  part_ids: string;
  comment_count: number;
  time_ago: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
}

// 🔷 الخدمة الموحدة
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private backendBase = 'http://localhost/news/backend';

  constructor(private http: HttpClient) { }

  // ✅ جلب جميع الأقسام (part.php)
  getAllParts(): Observable<Part[]> {
    return this.http.get<Part[]>(`${this.backendBase}/part.php`);
  }

  // ✅ جلب إحصائيات لوحة التحكم
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.backendBase}/get_dashboard_stats.php`);
  }

  // ✅ جلب إحصائيات التحليلات المخصصة
  getAnalyticsStats(): Observable<AnalyticsStats> {
    return this.http.get<AnalyticsStats>(`${this.backendBase}/analytics_stats.php`);
  }

  // ✅ Créer un nouveau post
  createPost(post: any): Observable<any> {
    return this.http.post<any>(`${this.backendBase}/create_post.php`, post);
  }

  // ✅ Récupérer les posts (avec pagination et filtrage par part_id)
  getPosts(page: number = 1, limit: number = 10, partId?: number): Observable<any> {
    const offset = (page - 1) * limit;
    let url = `${this.backendBase}/get_posts.php?limit=${limit}&offset=${offset}`;

    if (partId) {
      url += `&part_id=${partId}`;
    }

    return this.http.get<any>(url);
  }

  // ✅ حذف مقال
  deletePost(postId: number): Observable<any> {
    return this.http.get(`${this.backendBase}/delete_post.php?post_id=${postId}`);
  }
}
