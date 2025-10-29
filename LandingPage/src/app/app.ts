import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  languageService = inject(LanguageService);
  
  // Form data
  contactForm = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  // Tracking feature
  trackingNumber = '';
  trackingResult: any = null;
  trackingLoading = false;
  trackingError = '';

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

  // Track shipment
  trackShipment() {
    if (!this.trackingNumber || this.trackingNumber.trim().length < 5) {
      this.trackingError = this.t('tracking.error.invalid');
      return;
    }

    this.trackingLoading = true;
    this.trackingError = '';
    this.trackingResult = null;

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Demo data - In production, replace with actual API call
      const demoStatuses = [
        {
          status: 'delivered',
          steps: [
            { name: this.t('tracking.status.ordered'), date: '2025-10-20 10:30', completed: true },
            { name: this.t('tracking.status.picked'), date: '2025-10-21 14:20', completed: true },
            { name: this.t('tracking.status.transit'), date: '2025-10-22 08:15', completed: true },
            { name: this.t('tracking.status.customs'), date: '2025-10-24 16:45', completed: true },
            { name: this.t('tracking.status.delivery'), date: '2025-10-25 11:30', completed: true },
            { name: this.t('tracking.status.delivered'), date: '2025-10-26 09:15', completed: true }
          ],
          origin: 'Shanghai, China',
          destination: 'Dubai, UAE',
          estimatedDelivery: '2025-10-26',
          carrier: 'Global Logistics Express',
          weight: '450 kg',
          type: 'Air Freight'
        },
        {
          status: 'in-transit',
          steps: [
            { name: this.t('tracking.status.ordered'), date: '2025-10-25 09:00', completed: true },
            { name: this.t('tracking.status.picked'), date: '2025-10-26 11:30', completed: true },
            { name: this.t('tracking.status.transit'), date: '2025-10-27 15:45', completed: true },
            { name: this.t('tracking.status.customs'), date: '', completed: false },
            { name: this.t('tracking.status.delivery'), date: '', completed: false },
            { name: this.t('tracking.status.delivered'), date: '', completed: false }
          ],
          origin: 'Los Angeles, USA',
          destination: 'Jeddah, Saudi Arabia',
          estimatedDelivery: '2025-11-05',
          carrier: 'Global Logistics Sea',
          weight: '2,500 kg',
          type: 'Sea Freight'
        }
      ];

      // Select demo data based on tracking number
      const hash = this.trackingNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      this.trackingResult = demoStatuses[hash % 2];
      this.trackingLoading = false;
    }, 1500);
  }

  // Reset tracking
  resetTracking() {
    this.trackingNumber = '';
    this.trackingResult = null;
    this.trackingError = '';
    this.trackingLoading = false;
  }
}
