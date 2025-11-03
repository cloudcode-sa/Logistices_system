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
import emailjs from '@emailjs/browser';
import { Shipment } from 'src/app/inerface/shipment';
import { Dir } from "@angular/cdk/bidi";
@Component({
  selector: 'app-sample-page',
  imports: [CommonModule, FormsModule, RouterLink, Dir],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss']
})
export class SamplePageComponent {

statusSteps = [
  { key: 'pending', icon: 'bi-hourglass-split' },
  { key: 'shipped', icon: 'bi-truck' },
  { key: 'in_transit', icon: 'bi-arrow-repeat' }, // في البحر/الجو
  { key: 'arrived_at_port', icon: 'bi-building' },
  { key: 'received_in_china', icon: 'bi-flag' },
  { key: 'delivered', icon: 'bi-check-circle' }
];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newShipment: any;

// إرجاع عنوان الحالة مع مراعاة نوع الشحنة (reuse your getStatusLabel if present)
getStatusLabel(status: string | null | undefined, shipment?: Partial<Shipment>): string {
  const lang = this.currentLang;
  const rawType = (shipment?.shipment_type ?? this.newShipment?.shipment_type ?? 'sea');
  const type = String(rawType).trim().toLowerCase();

  switch (status) {
    case 'pending':
      return lang === 'ar' ? 'قيد الانتظار' : 'Pending';
    case 'shipped':
      return lang === 'ar' ? 'تم الشحن' : 'Shipped';
    case 'in_transit':
      return lang === 'ar' ? (type === 'air' ? 'في الهواء' : 'في البحر') : (type === 'air' ? 'In Transit (Air)' : 'In Transit (Sea)');
    case 'arrived_at_port':
      return lang === 'ar' ? 'وصلت الشحنة للميناء' : 'Arrived at Port';
    case 'received_in_china':
      return lang === 'ar' ? 'تم الاستلام في الصين' : 'Received in China';
    case 'delivered':
      return lang === 'ar' ? 'تم تسليم الشحنة للعميل' : 'Delivered to Customer';
    default:
      return status ? String(status) : (lang === 'ar' ? '-' : '-');
  }
}

// احصل على index الحالة الحالية في statusSteps (أو -1 لو مش موجودة)
private getCurrentStepIndex(status: string | null | undefined): number {
  if (!status) return -1;
  return this.statusSteps.findIndex(s => s.key === status);
}

// حساب نسبة التقدّم كنسبة مئوية
// ارجع رقم النسبة (0-100) مضبوط
getProgressPercent(status: string | null | undefined): number {
  if (!status) return 0;
  const idx = this.statusSteps.findIndex(s => s.key === status);
  const total = this.statusSteps.length;
  if (idx < 0) return 0;
  if (total <= 1) return 100;
  // نسبة مركز الخط للـ index
  return (idx / (total - 1)) * 100;
}

// ترجع قيمة CSS للـ width مع قابلية fine-tune عبر CSS var --line-offset
getProgressWidth(status: string | null | undefined): string {
  const pct = this.getProgressPercent(status);
  const clamped = Math.max(0, Math.min(100, Math.round(pct * 100) / 100)); // دقة 2 منازل
  if (clamped === 0) return '0%';
  if (clamped === 100) return '100%';
  // نخصم نصف قطر الدوت + متغيّر ضبط إضافي (--line-offset)
  // صيغة calc تسمح بالتحكم من CSS بدون تغيير TS
  return `calc(${clamped}% - (var(--dot-size) / 2) + var(--line-offset, 0px))`;
}

// للـ template: هل خطوة معينة نشطة أو مرّت بالفعل
isStepActive(stepKey: string, currentStatus: string | null | undefined): boolean {
  const idx = this.getCurrentStepIndex(currentStatus);
  const stepIdx = this.statusSteps.findIndex(s => s.key === stepKey);
  return stepIdx <= idx && idx >= 0;
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



  t(key: string): string {
    return this.languageService.translate(key);
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }

  get currentLang() {
    return this.languageService.currentLang();
  }

 contactForm = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };
  sending = false;

  private SERVICE_ID = 'service_aw55y99';      
  private TEMPLATE_ID = 'template_tc94tmk';    
  private PUBLIC_KEY = 'ajZSAolX2bLWi4YkT';    
  private ADMIN_EMAIL = 'belalelnagar01010@gmail.com';  

  submitForm() {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      alert('من فضلك أكمل الحقول المطلوبة');
      return;
    }

    this.sending = true;

    const templateParams = {
      to_email: this.ADMIN_EMAIL, 
      name: this.contactForm.name,
      email: this.contactForm.email,
      phone: this.contactForm.phone || '-',
      message: this.contactForm.message,
      time: new Date().toLocaleString()
    };

    emailjs.send(this.SERVICE_ID, this.TEMPLATE_ID, templateParams, this.PUBLIC_KEY)
      .then(() => {
        this.sending = false;
        alert('✅ تم إرسال الرسالة بنجاح!');
        this.contactForm = { name: '', email: '', phone: '', message: '' };
      })
      .catch((error) => {
        this.sending = false;
        console.error('EmailJS Error:', error);
        alert('❌ حدث خطأ أثناء الإرسال.');
      });
  }
}
