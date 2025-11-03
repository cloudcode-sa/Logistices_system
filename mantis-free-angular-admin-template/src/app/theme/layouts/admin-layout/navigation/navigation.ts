// src/app/theme/layouts/admin-layout/navigation/navigation.ts

// src/app/theme/layouts/admin-layout/navigation/navigation.ts
export interface NavigationItem {
  id: string;
  title?: string;
  translate?: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  hidden?: boolean;
  url?: string;
  link?: string;         // <<< اضف هذا الحقل (اختياري)
  path?: string;         // <<< اضف هذا الحقل (اختياري)
  description?: string;  // <<< اضف هذا الحقل (اختياري)
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
}


export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    translate: 'menu.dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        translate: 'menu.addShipment',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'dashboard',
        breadcrumbs: false
      },
      {
        id: 'ShipmentDetails',
        translate: 'menu.shipmentDetails',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/ShipmentDetails',
        icon: 'dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'other',
    translate: 'menu.other',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'sample-page',
        translate: 'menu.samplePage',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'chrome'
      },
      {
        id: 'document',
        translate: 'menu.documentation',
        type: 'item',
        classes: 'nav-item',
        url: 'https://codedthemes.gitbook.io/mantis-angular/',
        icon: 'question',
        target: true,
        external: true
      }
    ]
  }
];
