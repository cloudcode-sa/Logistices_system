import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/service/auth-service';
import { SpinnerComponent } from 'src/app/theme/shared/components/spinner/spinner.component';
import { supabase } from 'src/app/supabase.config';
@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent], // <--- مهم جدًا
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {

  ngOnInit(): void {
    // مثال لفحص session / user — Supabase JS v2
(async () => {
  const sessionRes = await supabase.auth.getSession();
  console.log('supabase.auth.getSession():', sessionRes);

  const userRes = await supabase.auth.getUser();
  console.log('supabase.auth.getUser():', userRes);

  // أيضاً افحص الـ headers في حالة أردت
})();

  }
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.router.navigate(['/dashboard/default']);
      }
    });
  }

  async login() {
    this.error = null;
    this.loading = true;
    try {
      await this.auth.signIn(this.email, this.password);
      await this.router.navigate(['/dashboard/default']);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      this.error = err?.message || 'فشل تسجيل الدخول. تأكد من البيانات.';
    } finally {
      this.loading = false;
    }
  }
}
