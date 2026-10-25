import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTerm: string = '';
  searchOpen$ = new BehaviorSubject<boolean>(false);  // حالة فتح/إغلاق البحث

  constructor(private http: HttpClient) {}

  // تعيين كلمة البحث
  setSearchTerm(term: string) {
    this.searchTerm = term.trim();
    if (this.searchTerm.length > 0) {
      this.searchOpen$.next(true);
    } else {
      this.searchOpen$.next(false);
    }
  }

  // دالة البحث (استدعاء API)
  searchData(term: string): Observable<any[]> {
    if (term.trim().length < 2) return of([]);
    // HttpParams بيعمل ترميز للكلمة (عربي، مسافات، رموز)
    const params = new HttpParams().set('query', term.trim());
    return this.http.get<any[]>('http://localhost/news/backend/search.php', { params });
  }

  // فتح البحث
  open() {
    this.searchOpen$.next(true);
  }

  // إغلاق البحث
  close() {
    this.searchOpen$.next(false);
  }

  // تعيين حالة البحث مباشرة
  setSearchOpen(isOpen: boolean) {
    this.searchOpen$.next(isOpen);
  }
}
