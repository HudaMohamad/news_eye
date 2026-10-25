import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of, map, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

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

    // نسخة GitHub Pages: ما في search.php، فمنبحث بفهرس JSON جوّا المتصفح
    if (environment.staticApi) {
      const query = term.trim();
      return this.staticIndex().pipe(
        map(items => items.filter(item => String(item.post_title).includes(query)).slice(0, 20))
      );
    }

    // HttpParams بيعمل ترميز للكلمة (عربي، مسافات، رموز)
    const params = new HttpParams().set('query', term.trim());
    return this.http.get<any[]>('http://localhost/news/backend/search.php', { params });
  }

  // فهرس البحث الثابت: بينحمّل مرة وحدة وبينحفظ للبحثات الجاية
  private index$?: Observable<any[]>;

  private staticIndex(): Observable<any[]> {
    this.index$ ??= this.http.get<any[]>('assets/api/search-index.json').pipe(shareReplay(1));
    return this.index$;
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
