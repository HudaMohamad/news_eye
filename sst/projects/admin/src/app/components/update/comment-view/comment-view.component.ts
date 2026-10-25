import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from './PostService';
import { AngularEditorComponent } from '@kolkov/angular-editor';

@Component({
  selector: 'app-comment-view',
  templateUrl: './comment-view.component.html',
  styleUrls: ['./comment-view.component.css']
})
export class CommentViewComponent implements OnInit {
  @ViewChild('editor') editor!: AngularEditorComponent;

  isSubmitting = false;
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  categoryId = 0;

  successMessage = '';
  errorMessage = '';

  // تخزين الملفات الإضافية قبل الرفع
  extraImages: File[] = [];

  editorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'اكتب محتوى الخبر هنا...',
    translate: 'no',
    toolbarHiddenButtons: [['insertImage']] // إخفاء زر إدراج الصورة
  };

  post = {
    post_id: 0,
    post_title: '',
    post_body: '',
    post_image: '',
    extra_images: [] as string[],
    options: {
      published: false,
      main: false,
      photographer: false,
      block: false,
      inLast: false,
      topmain: false
    }
  };

  optionKeys: (keyof typeof this.post.options)[] = [
    'published', 'main', 'photographer', 'block', 'inLast', 'topmain'
  ];

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit() {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    this.categoryId = Number(this.route.snapshot.queryParamMap.get('category_id')) || 1;

    if (!postId) {
      alert('⚠️ معرف الخبر غير موجود!');
      this.router.navigate(['/home/new']);
      return;
    }

    this.loadPost(postId, this.categoryId);
  }

  loadPost(postId: number, categoryId: number) {
    this.postService.getPostById(postId, categoryId).subscribe({
      next: (data) => {
        if (!data) {
          alert('❌ الخبر غير موجود!');
          this.router.navigate(['/home/new']);
          return;
        }

        this.post = {
          post_id: data.post_id,
          post_title: data.post_title || '',
          post_body: data.post_body || '',
          post_image: data.post_image || '',
          extra_images: data.extra_images ? data.extra_images.split(',') : [],
          options: {
            published: !!data.published,
            main: !!data.main,
            photographer: !!data.photographer,
            block: !!data.block,
            inLast: !!data.inLast,
            topmain: !!data.topmain
          }
        };

        this.previewUrl = this.post.post_image;
      },
      error: (err) => {
        console.error('خطأ في جلب الخبر:', err);
        alert('❌ حدث خطأ أثناء جلب الخبر');
      }
    });
  }

  // عند اختيار الصورة الرئيسية
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.selectedFile = file;

    // عرض معاينة الصورة مباشرة
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result as string);
    reader.readAsDataURL(file);
  }

  // عند اختيار الصور الإضافية
  onExtraImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      if (!file.type.startsWith('image/')) return;

      this.extraImages.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        const imgHTML = `<img src="${reader.result}" style="max-width:100%; border-radius:6px;" />`;

        if (this.editor && this.editor.textArea) {
          const editorEl = this.editor.textArea.nativeElement;
          editorEl.focus();
          document.execCommand('insertHTML', false, imgHTML);
        }
      };

      reader.readAsDataURL(file); // ← يحول الصورة إلى Base64
    });

    input.value = '';
  }




  // حفظ / تحديث الخبر
  onSubmit() {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('post_title', this.post.post_title);
    formData.append('post_body', this.post.post_body);

    // خيارات الخبر
    for (const key of this.optionKeys) {
      formData.append(key, this.post.options[key] ? '1' : '0');
    }

    // الصورة الرئيسية
    if (this.selectedFile) {
      formData.append('post_image', this.selectedFile);
    }

    // الصور الإضافية
    this.extraImages.forEach((file) => {
      formData.append('extra_images[]', file);
    });

    this.postService.updatePost(this.post.post_id, this.categoryId, formData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = '✅ تم تحديث الخبر بنجاح';
        this.router.navigate(['/home/new']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = '❌ حدث خطأ أثناء تحديث الخبر';
        console.error('خطأ في التحديث:', err);
      }
    });
  }
}
