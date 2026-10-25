import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-optiones',
  templateUrl: './optiones.component.html',
  styleUrls: ['./optiones.component.css']
})
export class OptionesComponent {

  settings = {
    site_name: '',
    site_description: '',
    facebook: '',
    x: '',
    youtube: '',
    telegram: '',
    android: ''
  };

  constructor(private http: HttpClient) {}

  saveSettings() {
    this.http.post(
      'http://localhost/news/backend/save-options.php',
      this.settings
    ).subscribe({
      next: (res: any) => {
        console.log('✅ تم الحفظ:', res);
        alert('تم حفظ الإعدادات بنجاح');
      },
      error: err => {
        console.error('❌ خطأ:', err);
        alert('حدث خطأ أثناء الحفظ');
      }
    });
  }
}
