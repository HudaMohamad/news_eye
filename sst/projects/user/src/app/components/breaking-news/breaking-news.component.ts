import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-breaking-news',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './breaking-news.component.html',
  styleUrls: ['./breaking-news.component.css']
})
export class BreakingNewsComponent implements OnInit {

  puns: string[] = [];
  today: string = new Date().toLocaleDateString('ar-EG');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost/news/backend/BreakingNews.php')
      .subscribe(res => {
        if (res.status === 'success') {
          this.puns = res.data;
        } else {
          console.error('Error fetching breaking news', res.message);
        }
      }, err => {
        console.error('HTTP Error', err);
      });
  }

}
