import { Component, OnInit } from '@angular/core';

interface Page {
  id: number;
  order: number;
  title: string;
  updated_at: string;
}

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  pages: Page[] = [];

  ngOnInit() {
    // بيانات تجريبية (بدّلها ببيانات من API أو service)
    this.pages = [
      { id: 6, order: 1, title: 'من نحن', updated_at: '2025-05-10 19:44:34' },
    ];
  }

  editPage(id: number) {
    console.log('تعديل الصفحة رقم:', id);
    // هنا ضع منطق التنقل أو الفتح للتعديل
  }
}
