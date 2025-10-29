# Global Logistics - Bilingual Landing Page

## Overview

A stunning, modern bilingual (Arabic RTL + English LTR) landing page for a global shipping and logistics company, built with **Angular 19** and **Tailwind CSS**.

## Features

### ✨ Core Features

- **Dual Language Support**: Seamless switching between English (LTR) and Arabic (RTL)
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices
- **Modern UI/UX**: Premium design with smooth animations and transitions
- **Professional Sections**:
  - Hero section with background image and gradient overlay
  - Company overview with statistics
  - Services showcase (Air Freight, Sea Freight, Customs, Warehousing)
  - Global network visualization
  - Client testimonials
  - Contact form
  - Comprehensive footer

### 🎨 Design Elements

- **Color Scheme**: Blue and white tones (symbolizing trust and global trade)
  - Primary Blue: #0066CC
  - Secondary Blue: #004C99
  - Light Blue: #E6F2FF
- **Typography**:
  - English: Poppins font family
  - Arabic: Cairo font family
- **Animations**: Fade-in effects, hover transitions, and smooth scrolling

### 🌐 Bilingual Implementation

The language service automatically detects browser language and supports:
- Complete translation of all UI elements
- RTL/LTR layout switching
- Font family switching based on language
- Dynamic HTML attributes (dir, lang)

## Technology Stack

- **Framework**: Angular 19
- **Styling**: Tailwind CSS 3.4.1
- **Language**: TypeScript
- **Build Tool**: Angular CLI
- **Package Manager**: npm

## Project Structure

```
global-logistics/
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   └── language.service.ts    # Bilingual translation service
│   │   ├── app.ts                      # Main component logic
│   │   ├── app.html                    # Landing page template
│   │   ├── app.css                     # Component styles
│   │   └── app.config.ts               # App configuration
│   ├── styles.css                      # Global styles with Tailwind
│   └── index.html                      # Main HTML file
├── public/
│   └── assets/                         # Images and media files
├── tailwind.config.js                  # Tailwind configuration
├── postcss.config.js                   # PostCSS configuration
└── package.json                        # Dependencies

```

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Steps

1. **Navigate to project directory**:
   ```bash
   cd global-logistics
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`

4. **Build for production**:
   ```bash
   npm run build
   ```
   Production files will be generated in `dist/global-logistics/browser/`

## Deployment Options

### Option 1: Static Hosting (Recommended)

The built application is a static site that can be deployed to:
- **Netlify**: Drag and drop the `dist/global-logistics/browser/` folder
- **Vercel**: Connect your repository and deploy automatically
- **GitHub Pages**: Use the built files
- **AWS S3 + CloudFront**: Upload to S3 bucket and serve via CloudFront
- **Firebase Hosting**: Use Firebase CLI to deploy

### Option 2: Traditional Web Server

Deploy to any web server (Apache, Nginx, etc.):

1. Build the production version:
   ```bash
   npm run build
   ```

2. Copy contents of `dist/global-logistics/browser/` to your web server root

3. Configure server for Single Page Application (SPA):
   
   **Nginx Example**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/dist/global-logistics/browser;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

   **Apache Example** (.htaccess):
   ```apache
   <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
   </IfModule>
   ```

## Customization Guide

### Updating Content

1. **Translations**: Edit `src/app/services/language.service.ts`
   - Modify the `translations` object for English and Arabic content

2. **Colors**: Edit `tailwind.config.js`
   ```javascript
   theme: {
     extend: {
       colors: {
         'primary-blue': '#0066CC',
         'secondary-blue': '#004C99',
         'light-blue': '#E6F2FF',
       },
     },
   }
   ```

3. **Images**: Replace files in `public/assets/`
   - hero-ship.webp (Hero background)
   - hero-container.jpg (Alternative hero image)
   - global-network.jpg (Network map)

4. **Company Information**: Update in `src/app/services/language.service.ts`
   - Contact details
   - Statistics (years, countries, shipments)
   - Testimonials

### Adding New Sections

1. Add HTML in `src/app/app.html`
2. Add translations in `src/app/services/language.service.ts`
3. Add styles in `src/app/app.css` or use Tailwind classes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

The production build includes:
- Code splitting
- Minification
- Tree shaking
- Asset optimization
- Lazy loading

**Production Bundle Size**:
- Main JS: ~263 KB (67 KB gzipped)
- Styles: ~25 KB (3.7 KB gzipped)
- Total: ~323 KB (82 KB gzipped)

## Key Features Implementation

### Language Switching

The language toggle button automatically:
1. Updates all text content
2. Changes HTML `dir` attribute (ltr/rtl)
3. Changes HTML `lang` attribute
4. Switches font families
5. Adjusts spacing and alignment

### Responsive Design

Breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Form Handling

The contact form includes:
- Client-side validation
- Required field checking
- Alert confirmation on submission
- Form reset after submission

## Troubleshooting

### Issue: Styles not loading

**Solution**: Ensure PostCSS and Tailwind are properly configured
```bash
npm install -D tailwindcss@3.4.1 postcss autoprefixer
```

### Issue: Language not switching

**Solution**: Check browser console for errors in language.service.ts

### Issue: Build fails

**Solution**: Clear cache and reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Support & Maintenance

### Regular Updates

1. Update Angular and dependencies:
   ```bash
   ng update @angular/cli @angular/core
   ```

2. Update Tailwind CSS:
   ```bash
   npm update tailwindcss
   ```

### Adding More Languages

To add additional languages (e.g., French, Spanish):

1. Add language to `language.service.ts`:
   ```typescript
   currentLang = signal<'en' | 'ar' | 'fr'>('en');
   
   translations = {
     en: { /* English translations */ },
     ar: { /* Arabic translations */ },
     fr: { /* French translations */ }
   }
   ```

2. Update toggle logic to cycle through languages

## License

This project is created for demonstration purposes. Customize as needed for your use case.

## Credits

- **Framework**: Angular (https://angular.dev)
- **CSS Framework**: Tailwind CSS (https://tailwindcss.com)
- **Fonts**: Google Fonts (Poppins, Cairo)
- **Images**: Sourced from logistics industry resources

## Contact

For questions or support regarding this landing page implementation, refer to the Angular documentation or Tailwind CSS guides.

---

**Live Demo URL**: https://4200-i61mesgsootnphzaqb8r8-d0757d6f.manusvm.computer

**Build Date**: October 28, 2025

**Version**: 1.0.0
