import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-follow',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.css']
})
export class FollowComponent implements OnInit {
  socialLinks: any = {};  // لتخزين روابط الشبكات الاجتماعية

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // جلب روابط السوشيال الأخيرة
    this.http.get<any>('http://localhost/news/backend/get-social-links.php')
      .subscribe({
        next: data => this.socialLinks = data,
        error: err => console.error('Failed to fetch social links', err)
      });
  }
}
