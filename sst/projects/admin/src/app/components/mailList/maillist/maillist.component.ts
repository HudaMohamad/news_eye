import { Component } from '@angular/core';

interface News {
  title: string;
  link: string;
}

@Component({
  selector: 'app-maillist',
  templateUrl: './maillist.component.html',
  styleUrls: ['./maillist.component.css']
})
export class MaillistComponent {
  mailList: string[] = [
    'example1@gmail.com',
    'example2@hotmail.com',
    'example3@yahoo.com',
  ];

  lastNews: News[] = [
    { title: 'انطلاق مشروع جديد لتطوير الواجهة', link: 'https://example.com/news1' },
    { title: 'تحديثات هامة في نظام الإدارة', link: 'https://example.com/news2' },
    { title: 'إطلاق نسخة جديدة من المنصة', link: 'https://example.com/news3' },
  ];

  loading = false;
  resultMessage = '';
  success = false;

  sendMails() {
    if (this.mailList.length === 0) {
      this.resultMessage = '⚠️ لا يوجد عناوين بريدية لإرسال الأخبار.';
      this.success = false;
      return;
    }

    this.loading = true;
    this.resultMessage = '';

    // ✅ محاكاة طلب إرسال البريد (مثل $.post)
    setTimeout(() => {
      this.loading = false;
      this.success = true;
      this.resultMessage = `✅ تم إرسال آخر الأخبار بنجاح إلى ${this.mailList.length} عنوان.`;
    }, 3000); // 3 ثوانٍ محاكاة للإرسال
  }
}
