import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(
    private router: Router,
    private authService: AuthService,
    private uiService: UiService
  ) { }

  toggleSidebar() {
    this.uiService.toggleSidebar();
  }

  logout() {
    this.authService.logout();
    alert('تم تسجيل الخروج بنجاح 👋');
    this.router.navigate(['/login']);
  }
}
