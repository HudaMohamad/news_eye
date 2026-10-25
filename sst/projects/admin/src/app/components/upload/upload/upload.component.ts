import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  @Output() imageUploaded = new EventEmitter<string>(); // الحدث الذي سيتم إرساله عند رفع الصورة

  previewUrl: string | null = null;  // لمعاينة الصورة
  uploadMessage: string | null = null;  // رسالة رفع الصورة
  selectedFile: File | null = null;  // لتخزين الملف المختار

  constructor(private http: HttpClient) {}

  // حدث تحديد الملف/
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file); // إنشاء معاينة للصورة
    }
  }

  // حدث رفع الصورة
  onUpload(): void {
    if (!this.selectedFile) {
      this.uploadMessage = 'يرجى اختيار صورة أولاً.';
      return;
    }

    // بناء FormData وإضافة الصورة
    const formData = new FormData();
    formData.append('image', this.selectedFile); // إضافة الصورة إلى FormData

    // إعدادات الـ HTTP
    const apiUrl = 'http://localhost/news/backend/upload.php'; // تأكد من المسار الصحيح
    const headers = new HttpHeaders();

    // إرسال الصورة إلى الخادم باستخدام HttpClient
    this.http.post<any>(apiUrl, formData, { headers }).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.imageUrl) {
          // عند رفع الصورة بنجاح، إرسال الرابط إلى المكون الأب
          this.imageUploaded.emit(response.imageUrl); 
          this.uploadMessage = 'تم رفع الصورة بنجاح!';
        } else {
          // في حال فشل رفع الصورة
          console.error('❌ فشل رفع الصورة');
          this.uploadMessage = 'حدث خطأ أثناء رفع الصورة.';
        }
      },
      error: (error) => {
        // في حال حدوث خطأ في الاتصال بالخادم
        console.error('❌ خطأ أثناء رفع الصورة:', error);
        this.uploadMessage = 'حدث خطأ في الاتصال بالخادم.';
      }
    });
  }
}
