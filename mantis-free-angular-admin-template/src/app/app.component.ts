// angular import
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

// project import
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';
import { AuthService } from './service/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, SpinnerComponent]
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  title = 'mantis-free-version';

  constructor() {
    this.auth.user$.subscribe(user => {
      if (user) {
        if (!this.router.url.startsWith('/dashboard/default')) {
          this.router.navigate(['/dashboard/default']);
        }
      }
    });

    // small fallback: if session exists on load, ensure redirect
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const s: any = await this.auth.getSession();
        const session = s?.session ?? s;
        if (session?.user) {
          if (!this.router.url.startsWith('/dashboard/default')) {
            this.router.navigate(['/dashboard/default']);
          }
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) { /* ignore */ }
    })();
  }
  // public props
}
