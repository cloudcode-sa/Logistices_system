// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';


import { LanguageService } from 'src/app/service/language-service';
import {  Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/service/auth-service';
import { Observable } from 'rxjs';
import { supabase } from 'src/app/supabase.config';
import * as L from 'leaflet';

@Component({
  selector: 'app-sample-page',
  imports: [CommonModule , FormsModule, RouterLink],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss']
})
export class SamplePageComponent {
getProgressWidth(status: string): string {
  switch (status) {
    case 'pending':
      return '33%';
    case 'shipped':
      return '66%';
    case 'received_in_china':
      return '100%';
    default:
      return '0';
  }
}

searchTerm = '';
  searchResult: any = null;
  searchAttempted = false;

  private map!: L.Map;
  private marker!: L.Marker;

  async searchShipment() {
    this.searchAttempted = true;
    this.searchResult = null;

    if (!this.searchTerm.trim()) return;

    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('shipment_number', this.searchTerm.trim())
        .single();

      if (error) throw error;

      this.searchResult = data;
      console.log('Shipment found:', data);

      // ✅ عرض الموقع على الخريطة لو متاح
      if (data.latitude && data.longitude) {
        this.updateMap(data.latitude, data.longitude);
      } else {
        // ارجع للخريطة الافتراضية لو مفيش موقع
        this.map.setView([30.0444, 31.2357], 5);
        if (this.marker) this.map.removeLayer(this.marker);
      }
    } catch (error) {
      console.error('Error fetching shipment:', error);
    }
  }

  formatMoney(amount: number): string {
    if (!amount) return '-';
    return '$' + Number(amount).toLocaleString();
  }

  ngAfterViewInit(): void {
    // إنشاء الخريطة
    this.map = L.map('shipmentMap').setView([30.0444, 31.2357], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private updateMap(lat: number, lng: number) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker([lat, lng]).addTo(this.map);
    this.map.setView([lat, lng], 10);
    this.marker.bindPopup('Shipment Location').openPopup();
  }

  // باقي الأكواد الأصلية بتاعتك
  private auth = inject(AuthService);
  private router = inject(Router);
  user$: Observable<any | null> = this.auth.user$;
  languageService = inject(LanguageService);

  goToDashboardOrLogin(isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.router.navigate(['/dashboard/default']).catch(err => console.warn(err));
    } else {
      this.router.navigate(['/login']).catch(err => console.warn(err));
    }
  }

  contactForm = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  mobileMenuOpen = false;

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.mobileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

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

  t(key: string): string {
    return this.languageService.translate(key);
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }

  get currentLang() {
    return this.languageService.currentLang();
  }

  
}
