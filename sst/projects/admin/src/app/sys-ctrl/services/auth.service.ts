import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = false;

  constructor() {
    // Restore session from sessionStorage on app reload
    this.loggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
  }

  login(): void {
    this.loggedIn = true;
    sessionStorage.setItem('admin_logged_in', 'true');
  }

  logout(): void {
    this.loggedIn = false;
    sessionStorage.removeItem('admin_logged_in');
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
