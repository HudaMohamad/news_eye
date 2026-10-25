import { Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { SearchService } from '../../sharing/search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap, of, catchError } from 'rxjs';
import { TimeAgoPipe } from '../../../../pipes/time-ago.pipe';
import { ImgFallbackDirective } from '../img-fallback.directive';
import { sectionName } from '../section-names';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TimeAgoPipe, ImgFallbackDirective],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnDestroy {
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  isOpen = false;
  term = '';
  results: any[] = [];
  loading = false;
  searched = false;
  sectionName = sectionName;

  private terms$ = new Subject<string>();
  private subs = new Subscription();

  constructor(private searchService: SearchService, private router: Router) {
    // الاستماع لتغيير حالة البحث من الـ service
    this.subs.add(this.searchService.searchOpen$.subscribe(val => {
      this.isOpen = val;
      // التركيز على حقل البحث أول ما تنفتح النافذة
      if (val) setTimeout(() => this.searchInput?.nativeElement.focus());
    }));

    // عند الانتقال لأي صفحة، أغلق البحث تلقائياً
    this.subs.add(this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.close();
      }
    }));

    // منستنى 300ms بعد آخر حرف قبل ما نبعت الطلب، بدل طلب مع كل حرف
    this.subs.add(this.terms$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.length < 2) {
          return of([]);
        }
        this.loading = true;
        return this.searchService.searchData(term).pipe(catchError(err => {
          console.error('Error fetching data: ', err);
          return of([]);
        }));
      })
    ).subscribe(data => {
      this.results = Array.isArray(data) ? data : [];
      this.loading = false;
      this.searched = this.term.trim().length >= 2;
    }));
  }

  // زر Esc بيسكّر البحث
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen) this.close();
  }

  close() {
    this.searchService.setSearchOpen(false);
    this.term = '';
    this.results = [];
    this.loading = false;
    this.searched = false;
    this.terms$.next('');
  }

  onSearch() {
    this.terms$.next(this.term.trim());
  }

  linkFor(item: any): string {
    const partNumber = String(item.part).replace('post', '');
    return `/part-${partNumber}/sub-${partNumber}/${item.id}`;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
