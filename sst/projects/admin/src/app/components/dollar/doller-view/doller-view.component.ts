import { Component } from '@angular/core';

@Component({
  selector: 'app-doller-view',
  templateUrl: './doller-view.component.html',
  styleUrls: ['./doller-view.component.css']
})
export class DollerViewComponent {

  // البيانات الأساسية
  dollar = {
    markazi_1: 14000,
    markazi_2: 13900,
    exchange: 14100
  };

  lastUpdate = new Date();
  today = new Date();

  updateDollar() {
    this.lastUpdate = new Date();
    alert('تم تحديث سعر الدولار بنجاح ✅');
    // هنا لاحقاً يمكن استدعاء API حقيقية مثل:
    // this.http.post('api/update-dollar', this.dollar).subscribe(...)
  }
}
