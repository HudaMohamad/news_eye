import { Component, OnInit } from '@angular/core';
import { ApiService, Part } from '../new/service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  parts: Part[] = [];   // مصفوفة الأقسام
  posts: any[] = [];    // مصفوفة الأخبار
  loading: boolean = false;
  totalPosts: number = 0;
  selectedCategoryId: number | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadParts();
  }

  // دالة مساعدة للتحقق من القيم
  checkStatus(value: number): string {
    return value === 1 ? 'check' : '-';
  }

  // ================= جلب الأقسام =================
  loadParts(): void {
    this.apiService.getAllParts().subscribe({
      next: (data: Part[]) => {
        // إضافة خاصية selected لكل قسم
        this.parts = data.map(part => ({
          ...part,
          part_id: Number(part.part_id),
          part_icon: this.cleanIcon(part.part_icon),
          selected: false  // خاصية لتحديد checkbox
        }));
      },
      error: (err) => console.error(err)
    });
  }

  // ================= عند تغيير القسم من القائمة المسدلة =================
  onDropdownChange(): void {
    if (this.selectedCategoryId) {
      this.fetchPosts(this.selectedCategoryId);
    } else {
      this.posts = [];
      this.totalPosts = 0;
    }
  }

  // ================= جلب الأخبار حسب القسم =================
  fetchPosts(categoryId: number): void {
    this.loading = true;
    this.posts = [];

    this.apiService.getPostsByCategory(categoryId).subscribe({
      next: (data: any[]) => {

        // هنا نعرض جميع الأخبار دون تصفيتها بناءً على المنشور، ونضيف فقط التحقق من الأعمدة المنشورة
        this.posts = data.map(post => ({
          ...post,
          post_date: post.post_date && post.post_date !== '0000-00-00 00:00:00' ? post.post_date : null,
          post_update: post.post_update && post.post_update !== '0000-00-00 00:00:00' ? post.post_update : null,



          main: Number(post.main),
          topmain: Number(post.topmain),
          photographer: Number(post.photographer),
          block: Number(post.block),
          inLast: Number(post.inLast),
          published: Number(post.published),



        }));
        this.totalPosts = this.posts.length;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // ================= اسم القسم =================
  getPartName(partId: number): string {
    const part = this.parts.find(p => p.part_id === partId);
    return part ? part.part_name : '';
  }

  // ================= أيقونة القسم =================
  getPartIcon(partId: number): string {
    const part = this.parts.find(p => p.part_id === partId);
    return part ? part.part_icon : 'fa fa-newspaper';
  }

  // ================= تنظيف الأيقونة =================
  cleanIcon(icon: string): string {
    if (!icon) return 'fa fa-newspaper';
    return icon.trim();
  }

  // ================= أزرار التحكم =================
  editPost(id: number) {
    console.log('Edit', id);
  }

  deletePost(postId: number, categoryId: number | null) {
    if (!categoryId) {
      alert('يرجى اختيار القسم أولاً!');
      return;
    }

    if (!confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;

    this.apiService.deletePost(postId, categoryId).subscribe({
      next: () => {
        this.posts = this.posts.filter(post => post.post_id !== postId);
        this.totalPosts = this.posts.length;
        console.log('تم حذف الخبر بنجاح');
      },
      error: err => {
        console.error('حدث خطأ أثناء الحذف:', err);
        alert('حدث خطأ أثناء حذف الخبر.');
      }
    });
  }



}
