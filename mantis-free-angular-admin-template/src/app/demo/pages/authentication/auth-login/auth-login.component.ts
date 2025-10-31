// src/app/auth/auth-login/auth-login.component.ts
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
  infoMessage: string | null = null;

  constructor() {
    this.auth.user$.subscribe(user => {
      if (user) {
        // redirect if user is found
        try {
          this.router.navigate(['/dashboard/default']);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        } catch (e) { /* ignore */ }
      }
    });
  }

  async sendMagicLink() {
    this.error = null;
    this.infoMessage = null;
    this.loading = true;
    try {
      await this.auth.signInWithMagicLink(this.email, window.location.origin + '/dashboard/default');
      this.infoMessage = 'تم إرسال لينك تسجيل الدخول إلى بريدك.';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      this.error = err?.message || 'Failed to send magic link';
    } finally {
      this.loading = false;
    }
  }


}
