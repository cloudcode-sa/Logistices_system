import { Injectable, signal } from '@angular/core';

export interface Translation {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang = signal<'en' | 'ar'>('en');

  translations: { [key: string]: Translation } = {
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.services': 'Services',
      'nav.contact': 'Contact',
      
      // Hero Section
      'hero.title': 'Your Global Shipping Partner',
      'hero.subtitle': 'Reliable Sea & Air Freight Solutions Connecting the World',
      'hero.cta': 'Get a Quote',
      'hero.learn': 'Learn More',
      
      // About Section
      'about.title': 'About Us',
      'about.heading': 'Leading the Way in Global Logistics',
      'about.text': 'With decades of experience in international shipping, we provide seamless logistics solutions that connect businesses across continents. Our commitment to excellence, reliability, and customer satisfaction has made us a trusted partner for companies worldwide.',
      'about.years': '25+ Years',
      'about.years.desc': 'Industry Experience',
      'about.countries': '150+ Countries',
      'about.countries.desc': 'Global Coverage',
      'about.shipments': '500K+ Shipments',
      'about.shipments.desc': 'Delivered Annually',
      
      // Services Section
      'services.title': 'Our Services',
      'services.heading': 'Comprehensive Logistics Solutions',
      'services.air.title': 'Air Freight',
      'services.air.desc': 'Fast and efficient air cargo services with global reach. We handle time-sensitive shipments with priority handling and real-time tracking.',
      'services.sea.title': 'Sea Freight',
      'services.sea.desc': 'Cost-effective ocean freight solutions for all cargo types. Full container load (FCL) and less than container load (LCL) options available.',
      'services.customs.title': 'Customs Clearance',
      'services.customs.desc': 'Expert customs brokerage services ensuring smooth clearance at all major ports worldwide.',
      'services.warehouse.title': 'Warehousing',
      'services.warehouse.desc': 'Secure storage facilities with advanced inventory management systems at strategic locations.',
      
      // Network Section
      'network.title': 'Global Network',
      'network.heading': 'Connected Worldwide',
      'network.text': 'Our extensive network spans across six continents, ensuring your cargo reaches any destination efficiently and reliably.',
      
      // Testimonials Section
      'testimonials.title': 'Client Testimonials',
      'testimonials.heading': 'What Our Clients Say',
      'testimonials.client1.name': 'Sarah Johnson',
      'testimonials.client1.company': 'Tech Solutions Inc.',
      'testimonials.client1.text': 'Outstanding service! Their team handled our urgent shipment with professionalism and delivered ahead of schedule.',
      'testimonials.client2.name': 'Ahmed Al-Rashid',
      'testimonials.client2.company': 'Global Trading Co.',
      'testimonials.client2.text': 'We have been working with them for 5 years. Reliable, efficient, and always responsive to our needs.',
      'testimonials.client3.name': 'Maria Garcia',
      'testimonials.client3.company': 'Export Masters Ltd.',
      'testimonials.client3.text': 'The best logistics partner we have ever had. Their tracking system and customer support are exceptional.',
      
      // Contact Section
      'contact.title': 'Contact Us',
      'contact.heading': 'Get in Touch',
      'contact.text': 'Ready to ship? Contact us today for a customized quote.',
      'contact.name': 'Full Name',
      'contact.email': 'Email Address',
      'contact.phone': 'Phone Number',
      'contact.message': 'Your Message',
      'contact.submit': 'Send Message',
      'contact.whatsapp': 'Chat on WhatsApp',
      'contact.phonecall': 'Call Us Now',
      
      // Tracking Section
      'tracking.title': 'Track Your Shipment',
      'tracking.subtitle': 'Enter your tracking number to get real-time updates',
      'tracking.placeholder': 'Enter tracking number (e.g., GL123456789)',
      'tracking.button': 'Track Shipment',
      'tracking.loading': 'Tracking...',
      'tracking.error.invalid': 'Please enter a valid tracking number (minimum 5 characters)',
      'tracking.results.title': 'Shipment Details',
      'tracking.results.new': 'Track Another',
      'tracking.details.number': 'Tracking Number',
      'tracking.details.type': 'Shipment Type',
      'tracking.details.origin': 'Origin',
      'tracking.details.destination': 'Destination',
      'tracking.details.weight': 'Weight',
      'tracking.details.estimated': 'Estimated Delivery',
      'tracking.timeline.title': 'Shipment Timeline',
      'tracking.timeline.pending': 'Pending',
      'tracking.status.ordered': 'Order Placed',
      'tracking.status.picked': 'Picked Up',
      'tracking.status.transit': 'In Transit',
      'tracking.status.customs': 'Customs Clearance',
      'tracking.status.delivery': 'Out for Delivery',
      'tracking.status.delivered': 'Delivered',
      
      // Footer
      'footer.about': 'About Company',
      'footer.about.text': 'Leading global logistics provider specializing in sea and air freight solutions.',
      'footer.quick': 'Quick Links',
      'footer.services.title': 'Services',
      'footer.contact.title': 'Contact Info',
      'footer.email': 'Email',
      'footer.phone': 'Phone',
      'footer.address': 'Address',
      'footer.address.text': '123 Logistics Avenue, Dubai, UAE',
      'footer.rights': '© 2025 Global Logistics. All rights reserved.',
    },
    ar: {
      // Navigation
      'nav.home': 'الرئيسية',
      'nav.about': 'من نحن',
      'nav.services': 'الخدمات',
      'nav.contact': 'اتصل بنا',
      
      // Hero Section
      'hero.title': 'شريكك العالمي في الشحن',
      'hero.subtitle': 'حلول شحن بحري وجوي موثوقة تربط العالم',
      'hero.cta': 'احصل على عرض سعر',
      'hero.learn': 'اعرف المزيد',
      
      // About Section
      'about.title': 'من نحن',
      'about.heading': 'نقود الطريق في عالم الشحن والخدمات اللوجستية!',
      'about.text': 'بخبرتنا الطويلة في الشحن الدولي، نربط شركتك بالعالم بخدمات ذكية وسلسة من الباب للباب. 🌍      نؤمن إن الراحة تبدأ من الثقة، ولهذا صرنا الخيار الأول لعدد كبير من الشركات اللي تعتمد علينا في كل شحنة وكل وجهة. 🚚✈️ معنا، شحنتك توصل بسرعة، وأمان، وراحة بال.',
      'about.years': '+25 عاماً',
      'about.years.desc': 'خبرة في المجال',
      'about.countries': '+150 دولة',
      'about.countries.desc': 'تغطية عالمية',
      'about.shipments': '+500 ألف شحنة',
      'about.shipments.desc': 'يتم تسليمها سنوياً',
      
      // Services Section
      'services.title': 'خدماتنا',
      'services.heading': 'حلول لوجستية شاملة',
      'services.air.title': 'الشحن الجوي',
      'services.air.desc': 'خدمات شحن جوي سريعة وفعالة مع تغطية عالمية. نتعامل مع الشحنات الحساسة للوقت مع معالجة ذات أولوية وتتبع في الوقت الفعلي.',
      'services.sea.title': 'الشحن البحري',
      'services.sea.desc': 'حلول شحن بحري فعالة من حيث التكلفة لجميع أنواع البضائع. خيارات الحاوية الكاملة والحاوية الجزئية متاحة.',
      'services.customs.title': 'التخليص الجمركي',
      'services.customs.desc': 'خدمات وساطة جمركية متخصصة تضمن تخليصاً سلساً في جميع الموانئ الرئيسية في العالم.',
      'services.warehouse.title': 'التخزين',
      'services.warehouse.desc': 'مرافق تخزين آمنة مع أنظمة إدارة مخزون متقدمة في مواقع استراتيجية.',
      
      // Network Section
      'network.title': 'الشبكة العالمية',
      'network.heading': 'متصلون في جميع أنحاء العالم',
      'network.text': 'تمتد شبكتنا الواسعة عبر ست قارات، مما يضمن وصول بضائعك إلى أي وجهة بكفاءة وموثوقية.',
      
      // Testimonials Section
      'testimonials.title': 'آراء العملاء',
      'testimonials.heading': 'ماذا يقول عملاؤنا',
      'testimonials.client1.name': 'سارة جونسون',
      'testimonials.client1.company': 'شركة الحلول التقنية',
      'testimonials.client1.text': 'خدمة متميزة! تعامل فريقهم مع شحنتنا العاجلة باحترافية وتم التسليم قبل الموعد المحدد.',
      'testimonials.client2.name': 'أحمد الراشد',
      'testimonials.client2.company': 'شركة التجارة العالمية',
      'testimonials.client2.text': 'نعمل معهم منذ 5 سنوات. موثوقون وفعالون ودائماً يستجيبون لاحتياجاتنا.',
      'testimonials.client3.name': 'ماريا غارسيا',
      'testimonials.client3.company': 'شركة خبراء التصدير',
      'testimonials.client3.text': 'أفضل شريك لوجستي تعاملنا معه. نظام التتبع ودعم العملاء استثنائيان.',
      
      // Contact Section
      'contact.title': 'اتصل بنا',
      'contact.heading': 'تواصل معنا',
      'contact.text': 'هل أنت مستعد للشحن؟ اتصل بنا اليوم للحصول على عرض أسعار مخصص.',
      'contact.name': 'الاسم الكامل',
      'contact.email': 'البريد الإلكتروني',
      'contact.phone': 'رقم الهاتف',
      'contact.message': 'رسالتك',
      'contact.submit': 'إرسال الرسالة',
      'contact.whatsapp': 'محادثة عبر واتساب',
      'contact.phonecall': 'اتصل بنا الآن',
      
      // Tracking Section
      'tracking.title': 'تتبع شحنتك',
      'tracking.subtitle': 'أدخل رقم التتبع للحصول على تحديثات فورية',
      'tracking.placeholder': 'أدخل رقم التتبع (مثل: GL123456789)',
      'tracking.button': 'تتبع الشحنة',
      'tracking.loading': 'جاري التتبع...',
      'tracking.error.invalid': 'يرجى إدخال رقم تتبع صالح (على الأقل 5 أحرف)',
      'tracking.results.title': 'تفاصيل الشحنة',
      'tracking.results.new': 'تتبع شحنة أخرى',
      'tracking.details.number': 'رقم التتبع',
      'tracking.details.type': 'نوع الشحنة',
      'tracking.details.origin': 'المنشأ',
      'tracking.details.destination': 'الوجهة',
      'tracking.details.weight': 'الوزن',
      'tracking.details.estimated': 'التسليم المتوقع',
      'tracking.timeline.title': 'الجدول الزمني للشحنة',
      'tracking.timeline.pending': 'قيد الانتظار',
      'tracking.status.ordered': 'تم الطلب',
      'tracking.status.picked': 'تم الاستلام',
      'tracking.status.transit': 'في الطريق',
      'tracking.status.customs': 'التخليص الجمركي',
      'tracking.status.delivery': 'في طريقه للتسليم',
      'tracking.status.delivered': 'تم التسليم',
      
      // Footer
      'footer.about': 'عن الشركة',
      'footer.about.text': 'شحنتك تبدأ من الصين وتوصلك للسعودية بسرعة وأمان! 🚚✈️ نقدم حلول شحن ذكية ومرنة للتجار والمتاجر الإلكترونية… نوصل بضاعتك بكل ثقة وفي الوقت اللي يناسبك.',
      'footer.quick': 'روابط سريعة',
      'footer.services.title': 'الخدمات',
      'footer.contact.title': 'معلومات الاتصال',
      'footer.email': 'البريد الإلكتروني',
      'footer.phone': 'الهاتف',
      'footer.address': 'العنوان',
      'footer.address.text': '123 شارع اللوجستيات، دبي، الإمارات',
      'footer.rights': '© 2025 الخدمات اللوجستية العالمية. جميع الحقوق محفوظة.',
    }
  };

  constructor() {
    // Check browser language preference
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'ar') {
      this.currentLang.set('ar');
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    }
  }

  toggleLanguage() {
    const newLang = this.currentLang() === 'en' ? 'ar' : 'en';
    this.currentLang.set(newLang);
    
    // Update HTML attributes
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLang);
  }

  translate(key: string): string {
    return this.translations[this.currentLang()][key] || key;
  }
}
