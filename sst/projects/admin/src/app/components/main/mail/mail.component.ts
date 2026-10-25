import { Component, OnInit } from '@angular/core';
import { ApiService, DashboardStats, AnalyticsStats } from '../../services/api.service';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {
  stats: DashboardStats = {
    total_posts: 0,
    total_members: 0,
    total_comments: 0,
    total_visits: 0
  };

  analytics: AnalyticsStats = {
    totalVisits: 0,
    todayVisits: 0,
    topSection: 'N/A',
    topPostId: 0
  };

  loading = true;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    // Fetch both traditional stats and new analytics numbers
    this.apiService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Error fetching dashboard stats:', err)
    });

    this.apiService.getAnalyticsStats().subscribe({
      next: (data) => {
        this.analytics = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching analytics stats:', err);
        this.loading = false;
      }
    });
  }

  // إفراغ محتوى الكاش
  clearCache(): void {
    if (confirm('هل أنت متأكد من إفراغ محتوى الكاش؟')) {
      alert('تم إفراغ الكاش بنجاح');
    }
  }
}
