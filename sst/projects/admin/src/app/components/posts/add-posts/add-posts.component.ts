import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ApiService, Part } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';

interface PostOptions {
  published: boolean;
  main: boolean;
  photographer: boolean;
  block: boolean;
  inLast: boolean;
  topmain: boolean;
}

interface PostData {
  title: string;
  content: string;
  author: string;
  tags: string;
  categories: number[];
  options: PostOptions;
  imageUrl: string;
  extra_images: string;
}

@Component({
  selector: 'app-add-posts',
  templateUrl: './add-posts.component.html',
  styleUrls: ['./add-posts.component.css']
})
export class AddPostsComponent implements OnInit {

  post: PostData = {
    title: '',
    content: '',
    author: 'سيريا ستار تايمز - syriastartimes',
    tags: '',
    categories: [],
    imageUrl: '',
    extra_images: '',
    options: {
      published: true,
      main: false,
      photographer: false,
      block: false,
      inLast: false,
      topmain: false
    }
  };

  parts: Part[] = [];
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  uploadMessage = '';

  selectedFile: File | null = null;
  previewUrl: string | null = null;



  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '200px',
    placeholder: 'اكتب محتوى الخبر هنا...',
    sanitize: false,

    toolbarHiddenButtons: [
      ['insertImage'] // نخفي زر الصورة فقط
    ]
  };



  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadParts();
  }

  loadParts(): void {
    this.apiService.getAllParts().subscribe({
      next: data => {
        this.parts = Array.isArray(data) ? data : [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'فشل تحميل الأقسام';
        this.isLoading = false;
      }
    });
  }

  onCategoryChange(partId: number): void {
    this.post.categories = [partId];
  }

  isCategorySelected(partId: number): boolean {
    return this.post.categories.includes(partId);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('الملف ليس صورة');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير (5MB كحد أقصى)');
      return;
    }

    this.selectedFile = file;
    this.previewUrl = URL.createObjectURL(file);
  }





  onSubmit(): void {
    if (!this.selectedFile) {
      this.errorMessage = '❌ يجب تحديد الصورة الرئيسية';
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const submitPostAfterUploads = () => this.submitPost();

    // رفع الصورة الرئيسية أولًا
    const formDataMain = new FormData();
    formDataMain.append('image', this.selectedFile);

    this.http.post<any>('http://localhost/news/backend/upload.php', formDataMain)
      .subscribe({
        next: res => {
          if (res.imageUrl) {
            this.post.imageUrl = res.imageUrl;

            // إذا هناك صور إضافية، نرفعها بعد الرئيسية
            if (this.extraImages.length > 0) {
              const formDataExtra = new FormData();
              this.extraImages.forEach(file => formDataExtra.append('images[]', file));

              this.http.post<any>('http://localhost/news/backend/extra_images.php', formDataExtra)
                .subscribe({
                  next: resExtra => {
                    if (resExtra.images && resExtra.images.length > 0) {
                      this.post.extra_images = JSON.stringify(resExtra.images);

                      // 🔁 استبدال الصور المؤقتة المرفوعة بنجاح فقط
                      let i = 0;
                      this.post.content = this.post.content.replace(
                        /<img[^>]+data-temp="true"[^>]*>/g,
                        (match) => {
                          const url = resExtra.images[i++];
                          if (url) {
                            return `<img src="${url}" style="max-width:100%; border-radius:6px;" />`;
                          }
                          // إذا لم ترفع الصورة، نحذف الوسم أو نبقي المؤقت (هنا سنحذفه لتجنب 404)
                          return '<!-- Image upload failed -->';
                        }
                      );
                    }

                    if (resExtra.errors && resExtra.errors.length > 0) {
                      console.warn('Some extra images failed to upload:', resExtra.errors);
                      // اختياري: تنبيه المستخدم بوجود صور لم ترفع
                    }

                    submitPostAfterUploads();
                  },
                  error: (err) => {
                    this.errorMessage = '❌ حدث خطأ أثناء رفع الصور الإضافية';
                    console.error('Error uploading extra images:', err);
                    this.isSubmitting = false;
                  }
                });



            } else {
              // لا توجد صور إضافية، نرسل البوست مباشرة
              submitPostAfterUploads();
            }

          } else {
            this.errorMessage = '❌ فشل رفع الصورة الرئيسية';
            this.isSubmitting = false;
          }
        },
        error: (err) => {
          this.errorMessage = '❌ حدث خطأ أثناء رفع الصورة الرئيسية';
          console.error('Error uploading main image:', err);
          this.isSubmitting = false;
        }
      });
  }







  submitPost(): void {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.apiService.createPost(this.post).subscribe({
      next: (res) => {
        if (res.status === 'success' || res.status === 'partial') {
          this.successMessage = res.message || '✅ تم إرسال الخبر بنجاح';
          setTimeout(() => { this.successMessage = ''; }, 5000);
          setTimeout(() => { this.resetForm(); }, 1000);
        } else {
          this.errorMessage = res.message || '❌ لم يتم حفظ الخبر';
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = '❌ حدث خطأ أثناء الإرسال';
        console.error('Error creating post:', err);
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.post = {
      title: '',
      content: '',
      author: 'سيريا ستار تايمز - syriastartimes',
      tags: '',
      categories: [],
      imageUrl: '',
      extra_images: '',
      options: {
        published: true,
        main: false,
        photographer: false,
        block: false,
        inLast: false,
        topmain: false
      }
    };

    this.selectedFile = null;
    this.previewUrl = null;
    this.extraImages = [];
    this.extraImageUrls = [];
    this.uploadMessage = '';
  }

  extraImages: File[] = [];
  extraImageUrls: string[] = [];

  onExtraImagesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;

      // 1) حجم الصورة (مثلاً 2MB كحد أقصى)
      if (file.size > 2 * 1024 * 1024) {
        alert(`الصورة "${file.name}" كبيرة جداً (الحد الأقصى 2MB)`);
        return;
      }

      // 2) نخزن الصورة للرفع النهائي
      this.extraImages.push(file);

      // 3) رابط مؤقت للمعاينة داخل المحرر فقط
      const tempUrl = URL.createObjectURL(file);

      // 4) نُدخل الصورة داخل المحتوى في الموضع الحالي للمؤشر
      this.post.content += `
      <p>
        <img 
          src="${tempUrl}" 
          data-temp="true"
          style="max-width:100%; border-radius:6px;"
        />
      </p>
    `;
    });

    event.target.value = '';
  }





  uploadExtraImages(): void {
    if (this.extraImages.length === 0) return;

    const formData = new FormData();
    this.extraImages.forEach(file => {
      formData.append('images[]', file);
    });

    this.http.post<any>(
      'http://localhost/news/backend/extra_images.php',
      formData
    ).subscribe(res => {
      if (res.images) {
        this.post.extra_images = JSON.stringify(res.images);
      }
    });
  }





}
