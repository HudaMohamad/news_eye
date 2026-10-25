import { Component } from '@angular/core';

@Component({
  selector: 'app-conactus',
  templateUrl: './conactus.component.html',
  styleUrls: ['./conactus.component.css']
})
export class ConactusComponent {
  form = {
    name: '',
    email: '',
    message: ''
  };

  // دالة لإرسال النموذج
  onSubmit() {
    console.log('تم إرسال النموذج:', this.form);
    alert('تم إرسال الرسالة بنجاح!');
  }

  // دالة النسخ
  copyText(text: string, event: Event) {
    navigator.clipboard.writeText(text).then(() => {
      // خيار: إظهار رسالة صغيرة عند النسخ
      const target = event.target as HTMLElement;
      const original = target.innerText;
      target.innerText = '✔ تم النسخ';
      setTimeout(() => {
        target.innerText = original;
      }, 1000);
    });
  }
}
