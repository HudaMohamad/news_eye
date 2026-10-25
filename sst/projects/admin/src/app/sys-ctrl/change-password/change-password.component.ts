import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  form: FormGroup;
  successMessage: string = '';

  // متغيرات لتبديل إظهار كلمة السر
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      oldEmail: ['', [Validators.required, Validators.email]],
      oldPassword: ['', [Validators.required]],
      newEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }

  toggleOldPassword() { this.showOldPassword = !this.showOldPassword; }
  toggleNewPassword() { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = {
      oldEmail: this.form.value.oldEmail,
      oldPassword: this.form.value.oldPassword,
      newEmail: this.form.value.newEmail,
      password: this.form.value.password
    };

    this.http.post<any>('http://localhost/news/backend/update_admin.php', data)
      .subscribe(res => {
        if (res.status === 'success') {
          this.successMessage = '✅ تم تعديل البيانات بنجاح';
          // التوجيه بعد 2 ثانية
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          console.error('خطأ أثناء التحديث:', res.message);
        }
      }, err => {
        console.error('حدث خطأ في الاتصال بالخادم:', err);
      });
  }
}
