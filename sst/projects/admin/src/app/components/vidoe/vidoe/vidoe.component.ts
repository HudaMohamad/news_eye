import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TimeAgoPipe } from '../../../../../../user/pipes/time-ago.pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-vidoe',
  templateUrl: './vidoe.component.html',
  styleUrls: ['./vidoe.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, TimeAgoPipe]
})
export class VidoeComponent {

  videos: any[] = [];            // قائمة الفيديوهات
  videoUrl: string = '';         // رابط جديد لإضافة الفيديو
  currentVideoUrl!: SafeResourceUrl | null; // رابط آمن للفيديو المعروض

  constructor(public sanitizer: DomSanitizer, private http: HttpClient) {}

  ngOnInit() {
    this.loadVideos();
  }

  // تحميل الفيديوهات من الخادم
 loadVideos() {
  this.http.get<any>('http://localhost/news/backend/get_videos.php')
    .subscribe(res => {
      if (res.status === 'success') {
        this.videos = res.videos;

        // ترتيب الفيديوهات حسب التاريخ من الأحدث للأقدم
        this.videos.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        // عرض الفيديو الأحدث
        if (this.videos.length > 0) {
          this.showSafeVideo(this.videos[0]); // الآن الأحدث هو الأول
        } else {
          this.currentVideoUrl = null;
        }
      } else {
        alert('خطأ في جلب الفيديوهات');
      }
    });
}


  // إضافة فيديو جديد
  addVideo() {
    if (!this.videoUrl.trim()) return;

    this.http.post<any>('http://localhost/news/backend/upload_video.php', { videoId: this.videoUrl })
      .subscribe(res => {
        if (res.status === 'success') {
          // إنشاء كائن الفيديو الجديد مؤقتًا للعرض الفوري
          const newVideo = { url: this.videoUrl, created_at: new Date().toISOString() };
          this.videos.push(newVideo);        // إضافته لقائمة الفيديوهات
          this.showSafeVideo(newVideo);      // عرضه مباشرة
          this.videoUrl = '';                 // تنظيف الحقل
        } else {
          alert(res.message);
        }
      });
  }

  // حذف فيديو
  deleteVideo(index: number, videoId: number) {
    if (!confirm('هل تريد حذف الفيديو؟')) return;

    this.http.post<any>('http://localhost/news/backend/delete_video.php', { id: videoId })
      .subscribe(res => {
        if (res.status === 'success') {
          this.videos.splice(index, 1);

          // تحديث الفيديو المعروض بعد الحذف
          if (this.videos.length > 0) {
            const newIndex = index > 0 ? index - 1 : 0;
            this.showSafeVideo(this.videos[newIndex]);
          } else {
            this.currentVideoUrl = null;
          }
        } else {
          alert(res.message || 'فشل حذف الفيديو');
        }
      });
  }

  // عرض فيديو معين في الـ iframe
  showSafeVideo(video: any) {
    const id = this.extractVideoId(video.url);
    if (id) {
      const embedLink = `https://www.youtube.com/embed/${id}?rel=0`;
      this.currentVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedLink);
    } else {
      this.currentVideoUrl = null;
    }
  }

  // استخراج ID من روابط يوتيوب المختلفة
  private extractVideoId(link: string): string | null {
    let videoId: string | null = null;

    if (link.includes('youtu.be/')) {
      videoId = link.split('youtu.be/')[1].split('?')[0];
    } else if (link.includes('youtube.com/watch?v=')) {
      videoId = link.split('v=')[1].split('&')[0];
    } else if (link.includes('shorts/')) {
      videoId = link.split('shorts/')[1].split('?')[0];
    }

    return videoId;
  }
}
