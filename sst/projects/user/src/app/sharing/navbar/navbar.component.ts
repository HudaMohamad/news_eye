import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ApiService, Part } from '../services/api.service';
import { SearchService } from '../../sharing/search.service';
import { RouterModule } from '@angular/router';
import { BreakingNewsComponent } from '../../components/breaking-news/breaking-news.component';

@Component({
  selector: 'app-navbar',
  standalone: true,   // <-- هنا صار كومبوننت مستقل
  imports: [CommonModule,
    BreakingNewsComponent,
    RouterModule
  ],  // استدعاء CommonModule لأي توجيهات أساسية مثل *ngIf و *ngFor
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  parts: Part[] = [];
  isMenuOpen = false;

  constructor(private apiService: ApiService, private searchService: SearchService) {}

  ngOnInit(): void {
    this.apiService.getAllParts().subscribe({
      next: data => this.parts = data,
      error: err => console.error('Error fetching parts:', err)
    });
  }

  // عند الضغط على زر البحث
  openSearch() {
    this.searchService.open();  // فتح نموذج البحث في SearchComponent
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMenu(event: Event) {
    this.isMenuOpen = !this.isMenuOpen;
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  closeMenu(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar')) this.isMenuOpen = false;
  }
}
