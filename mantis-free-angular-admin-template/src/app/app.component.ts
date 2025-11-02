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
    

  }}
