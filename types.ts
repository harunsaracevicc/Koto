export interface LocalizedString {
  en: string;
  bs: string;
}

export interface MenuItem {
  id: number;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  category: string;
  image: string;
  isSignature?: boolean;
  subcategory?: string;
}

export interface GalleryItem {
  id: number;
  image: string;
  alt: LocalizedString;
  size?: 'normal' | 'large' | 'tall' | 'wide';
}

export interface NavLink {
  name: string;
  path: string;
  isButton?: boolean;
}
