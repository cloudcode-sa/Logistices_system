// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';


import { LanguageService } from 'src/app/service/language-service';
import {  Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/service/auth-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sample-page',
  imports: [CommonModule , FormsModule, RouterLink],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss']
})
export class SamplePageComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  // نحفظ الـ observable مباشرة
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user$: Observable<any | null> = this.auth.user$;

  goToDashboardOrLogin(isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.router.navigate(['/dashboard/default']).catch(err => console.warn(err));
    } else {
      this.router.navigate(['/login']).catch(err => console.warn(err));
    }
  }
  
    languageService = inject(LanguageService);
  
  // Form data
  contactForm = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  // Mobile menu state
  mobileMenuOpen = false;

  // Scroll to section
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.mobileMenuOpen = false;
    }
  }

  // Toggle mobile menu
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  // Submit contact form
  submitForm() {
    console.log('Form submitted:', this.contactForm);
    alert(this.t('contact.success') || 'Thank you! We will contact you soon.');
    this.contactForm = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
  }

  // Get translation
  t(key: string): string {
    return this.languageService.translate(key);
  }

  // Toggle language
  toggleLanguage() {
    this.languageService.toggleLanguage();
  }

  // Get current language
  get currentLang() {
    return this.languageService.currentLang();
  }
}
