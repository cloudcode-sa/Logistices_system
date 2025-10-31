// angular import
import { Component, inject, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// project import

// icon
import { IconService, IconDirective } from '@ant-design/icons-angular';
import {
  BellOutline,
  SettingOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline,
  GithubOutline
} from '@ant-design/icons-angular/icons';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth-service';

@Component({
  selector: 'app-nav-right',
  imports: [IconDirective, RouterModule, NgScrollbarModule, NgbNavModule, NgbDropdownModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
   private auth = inject(AuthService);
  private router = inject(Router);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user$: Observable<any | null> = this.auth.user$;
    async logout() {
    try {
      await this.auth.signOut();
      this.router.navigate(['/']); // يرجع المستخدم للصفحة الرئيسية بعد تسجيل الخروج
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }
  private iconService = inject(IconService);

  styleSelectorToggle = input<boolean>();
  Customize = output();
  windowWidth: number;
  screenFull: boolean = true;

  constructor() {
    this.windowWidth = window.innerWidth;
    this.iconService.addIcon(
      ...[
        CheckCircleOutline,
        GiftOutline,
        MessageOutline,
        SettingOutline,
        PhoneOutline,
        LogoutOutline,
        UserOutline,
        EditOutline,
        ProfileOutline,
        QuestionCircleOutline,
        LockOutline,
        CommentOutline,
        UnorderedListOutline,
        ArrowRightOutline,
        BellOutline,
        GithubOutline,
        WalletOutline
      ]
    );
  }

  profile = [
 
    {
      icon: 'logout',
      title: 'Logout'
    }
  ];

  setting = [
    {
      icon: 'question-circle',
      title: 'Support'
    },
    {
      icon: 'user',
      title: 'Account Settings'
    },
    {
      icon: 'lock',
      title: 'Privacy Center'
    },
    {
      icon: 'comment',
      title: 'Feedback'
    },
    {
      icon: 'unordered-list',
      title: 'History'
    }
  ];
}
