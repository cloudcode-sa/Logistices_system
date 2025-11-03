import { Component, OnInit, inject, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule, Location, LocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { NavigationItem, NavigationItems } from '../navigation';
import { environment } from 'src/environments/environment';

import { NavGroupComponent } from './nav-group/nav-group.component';

// icon
import { IconService } from '@ant-design/icons-angular';
import {
  DashboardOutline,
  CreditCardOutline,
  LoginOutline,
  QuestionOutline,
  ChromeOutline,
  FontSizeOutline,
  ProfileOutline,
  BgColorsOutline,
  AntDesignOutline
} from '@ant-design/icons-angular/icons';
import { NgScrollbarModule } from 'ngx-scrollbar';

// translation service
import { LanguageService } from 'src/app/service/language-service';

@Component({
  selector: 'app-nav-content',
  standalone: true,
  imports: [CommonModule, RouterModule, NavGroupComponent, NgScrollbarModule],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  private location = inject(Location);
  private locationStrategy = inject(LocationStrategy);
  private iconService = inject(IconService);
  private languageService = inject(LanguageService);

  @Output() NavCollapsedMob = new EventEmitter<void>();

  // version
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  // window width
  windowWidth = window.innerWidth;

  // computed navigation: يبني نسخة مترجمة من NavigationItems
  navigation = computed<NavigationItem[]>(() => {
    return NavigationItems.map(item => this.translateItem(item));
  });

  constructor() {
    this.iconService.addIcon(
      ...[
        DashboardOutline,
        CreditCardOutline,
        FontSizeOutline,
        LoginOutline,
        ProfileOutline,
        BgColorsOutline,
        AntDesignOutline,
        ChromeOutline,
        QuestionOutline
      ]
    );
  }

  ngOnInit() {
    // تصحيح شرط النافذة
    if (this.windowWidth < 1025) {
      const navEl = document.querySelector('.coded-navbar') as HTMLDivElement | null;
      if (navEl) {
        navEl.classList.add('menupos-static');
      }
    }
  }

  // بناء كائن جديد مع ترجمة العنوان (لا نغيّر المصدر الأصلي)
  private translateItem(item: NavigationItem): NavigationItem {
    const title = item.translate ? this.languageService.translate(item.translate) : (item.title ?? item.id);
    const children = item.children ? item.children.map(c => this.translateItem(c)) : undefined;
    return { ...item, title, children };
  }

  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
    }
  }

  navMob() {
    if (this.windowWidth < 1025) {
      const navComp = document.querySelector('app-navigation.coded-navbar');
      if (navComp?.classList.contains('mob-open')) {
        this.NavCollapsedMob.emit();
      }
    }
  }

  // helper: إغلاق الريست (إن احتجت استعمالها)
  closeOtherMenu(event?: Event) {
    // استخدم حسب حاجتك
    if (event) {
      event.stopPropagation();
    }
  }
}
