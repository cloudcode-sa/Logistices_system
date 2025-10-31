import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/service/auth-service';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor() {
    // لو المستخدم بالفعل مسجل دخول -> يحوله على الداشبورد
    this.auth.user$.subscribe(user => {
      if (user) {
        try {
          this.router.navigate(['/dashboard/default']);
        } catch {
          // تجاهل أي خطأ أثناء التوجيه
        }
      }
    });
  }

  // ✅ تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
  async login() {
    this.error = null;
    this.loading = true;

    try {
      await this.auth.signIn(this.email, this.password); // ✅ استخدم signIn بدل signInWithPassword
      await this.router.navigate(['/dashboard/default']); // ✅ توجيه بعد تسجيل الدخول
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      this.error = err?.message || 'فشل تسجيل الدخول. تأكد من البيانات.';
    } finally {
      this.loading = false;
    }
  }
}
