import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Angulartics2GoogleGlobalSiteTag } from 'angulartics2';
import { TrackingService } from './services/tracking.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sst';

  constructor(
    private angulartics2GoogleGlobalSiteTag: Angulartics2GoogleGlobalSiteTag,
    private router: Router,
    private trackingService: TrackingService
  ) {
    this.angulartics2GoogleGlobalSiteTag.startTracking();
  }

  ngOnInit() {
    // Global tracking listener
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.handleInternalTracking(event.urlAfterRedirects);
    });
  }

  private handleInternalTracking(url: string) {
    if (url === '/' || url === '/home' || url === '') {
      this.trackingService.logVisit('Home');
      return;
    }

    // Example pattern matching for analytics aggregation
    // URL: /part-19/sub-19/123 -> section='part-19', post_id='123'
    const partMatch = url.match(/\/part-(\d+)/);
    const subMatch = url.match(/\/sub-\d+\/(\d+)/);

    const section = partMatch ? `Section ${partMatch[1]}` : 'Other';
    const postId = subMatch ? parseInt(subMatch[1], 10) : null;

    this.trackingService.logVisit(section, postId);
  }
}
