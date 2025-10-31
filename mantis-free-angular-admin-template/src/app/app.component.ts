// Angular imports
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

// Project imports
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';
import { AuthService } from './service/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, SpinnerComponent]
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  title = 'mantis-free-version';

  constructor() {
    // متابعة تغييرات المستخدم لحظيًا
    this.auth.user$.subscribe(user => {
      if (user) {
        // لو المستخدم مسجل دخول → توجيه للداشبورد
        if (!this.router.url.startsWith('/dashboard/default')) {
          this.router.navigate(['/dashboard/default']);
        }
      } else {
        // لو مفيش مستخدم → توجيه لل-login
        if (!this.router.url.startsWith('/login')) {
          this.router.navigate(['/login']);
        }
      }
    });

    // استرجاع الجلسة الحالية عند تحميل الصفحة لأول مرة
    this.checkInitialSession();
  }

  private async checkInitialSession() {
    try {
      const session = await this.auth.getSession();
      const user = session?.user ?? null;

      if (user) {
        if (!this.router.url.startsWith('/dashboard/default')) {
          this.router.navigate(['/dashboard/default']);
        }
      } else {
        if (!this.router.url.startsWith('/login')) {
          this.router.navigate(['/login']);
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // تجاهل أي خطأ بسيط أثناء التحقق
    }
  }
}
