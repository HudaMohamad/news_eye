import { Component, OnInit } from '@angular/core';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isSidebarVisible: boolean = false;

  constructor(private uiService: UiService) { }

  ngOnInit() {
    this.uiService.sidebarVisible$.subscribe(visible => {
      this.isSidebarVisible = visible;
    });
  }
}
