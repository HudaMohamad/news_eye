import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Initialize form immediately to prevent reactive form directive errors
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    // If already logged in, redirect to home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.http.post<any>('http://localhost/news/backend/login.php', this.loginForm.value, {
        withCredentials: true  // Send session cookies
      })
        .subscribe(res => {
          this.isLoading = false;
          if (res.status === 'success') {
            console.log('✅ تسجيل الدخول ناجح');
            this.authService.login();
            this.router.navigate(['/home']);
          } else {
            alert('❌ ' + (res.message || 'اسم المستخدم أو كلمة المرور غير صحيحة'));
          }
        }, error => {
          this.isLoading = false;
          if (error.status === 429) {
            alert('⚠️ محاولات كثيرة جداً. يرجى المحاولة بعد 15 دقيقة');
          } else {
            alert('❌ حدث خطأ في الاتصال');
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  goToChangePassword() {
    this.router.navigate(['/change-password']);
  }
}
