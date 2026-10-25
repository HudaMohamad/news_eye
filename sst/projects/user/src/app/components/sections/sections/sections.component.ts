import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ أضف هذا
import { ApiService, Part } from '../../../sharing/services/api.service';

declare var Swiper: any;

@Component({
  selector: 'app-sections',
  standalone: true, // ✅ أصبح standalone
  imports: [CommonModule, RouterModule], // ✅ أضف RouterModule هنا
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit, AfterViewInit {

  parts: Part[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAllParts().subscribe({
      next: (data) => {
        this.parts = data;
        setTimeout(() => this.initSwiper(), 100);
      },
      error: (err) => {
        console.error('❌ خطأ في تحميل الأقسام:', err);
      }
    });
  }

  ngAfterViewInit(): void {}

  initSwiper(): void {
    new Swiper('.swiper', {
      slidesPerView: 5,
      slidesPerGroup: 5,
      spaceBetween: 6,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      speed: 800,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      }
    });
  }

  getCardClasses(item: Part) {
    const cardNumber = Number(item.part_id) % 10 || 10;
    return {
      card: true,
      ['card-' + cardNumber]: true
    };
  }

  getButtonClasses(item: Part) {
    const cardNumber = Number(item.part_id) % 10 || 10;
    return {
      'card-button': true,
      ['btn-' + cardNumber]: true
    };
  }

  getIconClasses(item: Part, iconClass: string) {
    const cardNumber = Number(item.part_id) % 10 || 10;
    return `${iconClass} icon-${cardNumber}`;
  }
}
