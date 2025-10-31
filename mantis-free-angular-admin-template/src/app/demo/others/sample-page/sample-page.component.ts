// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';


import { LanguageService } from 'src/app/service/language-service';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sample-page',
  imports: [CommonModule, RouterOutlet, FormsModule, RouterLink],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss']
})
export class SamplePageComponent {

  
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
